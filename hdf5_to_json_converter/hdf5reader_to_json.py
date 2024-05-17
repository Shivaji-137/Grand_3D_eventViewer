class event_3D_viewer:
    def __init__(self, hdffile, geofile):
        self.hdffile = open(hdffile, 'rb')
        self.geofile = open(geofile, 'rb')
        self.tstep = 1500
        self.fmin = 50.e6
        self.fmax = 200.e6
        self.geo_df = pd.read_csv(self.geofile, sep=" ", usecols=[1, 2, 3, 4])
        self.geo_df['ID'] = np.array([str(ant_name) for ant_name in self.geo_df['ID']])

    def get_geometry(self):
        self.posx = self.geo_df['X'] / 1.e3
        self.posy = self.geo_df['Y'] / 1.e3
        self.posz = self.geo_df['Z'] / 1.e3
        return self.posx, self.posy, self.posz

    def get_data(self):
            # Collect information of an event required to make plots in event-display.
        self.run_info   = hdf5io.GetRunInfo(self.hdffile)
        event_num       = hdf5io.GetNumberOfEvents(self.run_info)-1
        self.eventname  = hdf5io.GetEventName(self.run_info,event_num)
        self.event_info = hdf5io.GetEventInfo(self.hdffile, self.eventname)
        self.ant_info   = hdf5io.GetAntennaInfo(self.hdffile, self.eventname)
        self.peaktime, self.peakamplitude = mix.get_filtered_peakAmpTime_Hilbert(self.hdffile, 
																				 self.eventname, 
																				 self.ant_info, 
																				 self.fmin, self.fmax)		
        self.ant_info['peakamplitude']= self.peakamplitude
            # filtered peak time and peak amplitude calculated after hilbert transform.		
        sorted_indx     = self.ant_info.argsort('T0')          # index based on increasing time.
        sorted_antInfo  = self.ant_info[sorted_indx]
        self.hitAnt     = sorted_antInfo['ID']
        self.hitAnt     = np.array([str(ant_name) for ant_name in self.hitAnt])
        self.peakamplitude = sorted_antInfo['peakamplitude']
            # Match antennae name in geometry file with antennae name in event file.
        if ('A' in self.geo_df['ID'][0]) and ('A' not in self.hitAnt[0]):
            modified_ant_name = [ant_name[1:] for ant_name in self.geo_df['ID']]
            self.geo_df['ID'] = modified_ant_name
        elif ('A' not in self.geo_df['ID'][0]) and ('A' in self.hitAnt[0]):
            modified_ant_name = ['A'+ant_name for ant_name in self.geo_df['ID']]
            self.geo_df['ID'] = modified_ant_name
        '''
            Position of Antennae changes based on shower core. This gives variable antannae position if taken from AntennaeInfo. 
            So antennae position is taken from the geometry based on Antennae ID. These are position of hit antennae in GRAND coordinate system.
        '''		
        self.hitX       = np.array([(self.geo_df[self.geo_df.ID.eq(ant_name)]['X']).values[0] for ant_name in self.hitAnt])/1.e3
        self.hitY       = np.array([(self.geo_df[self.geo_df.ID.eq(ant_name)]['Y']).values[0] for ant_name in self.hitAnt])/1.e3
        self.hitZ       = np.array([(self.geo_df[self.geo_df.ID.eq(ant_name)]['Z']).values[0] for ant_name in self.hitAnt])/1.e3
            # Position of hit antannae from shower core.
        self.hitXc      = sorted_antInfo['X']          #x-coordinate of hit antenna from shower core. Used to plot kXB, kX(kXB), K plot.
        self.hitYc      = sorted_antInfo['Y']          #y-coordinate of hit antenna from shower core. Used to plot kXB, kX(kXB), K plot.
        self.hitZc      = sorted_antInfo['Z']          #z-coordinate of hit antenna from shower core. Used to plot kXB, kX(kXB), K plot.		
        self.hitT       = sorted_antInfo['T0']
        self.peakA      = sorted_antInfo['peakamplitude']
            # More info related to the shower.
        self.primary    = hdf5io.GetEventPrimary(self.run_info, event_num)
        self.energy     = hdf5io.GetEventEnergy(self.run_info, event_num)	
        self.zenith     = np.deg2rad(hdf5io.GetEventZenith(self.run_info, event_num))
        self.azimuth    = np.deg2rad(hdf5io.GetEventAzimuth(self.run_info, event_num))
        self.bFieldIncl = np.pi/2. + np.deg2rad(hdf5io.GetEventBFieldIncl(self.event_info))
        self.bFieldDecl = -1.*np.deg2rad(hdf5io.GetEventBFieldDecl(self.event_info)) #0.
        self.x_xmax, self.y_xmax, self.z_xmax = hdf5io.GetXmaxPosition(self.event_info).data[0]
        self.slant_xmax = hdf5io.GetEventSlantXmax(self.run_info, event_num)
            # additional info.
        self.tbins         = np.arange(min(self.hitT)-2*self.tstep, max(self.hitT)+2*self.tstep, self.tstep) # time boundary to look for hits.
        self.nhits         = len(self.hitX)
        self.palette_color = color_pallette(len(self.hitX))
        self.Eweight       = self.peakA + 15.
        return self.hitX, self.hitY, self.hitZ, self.hitT, self.tbins, self.nhits, self.Eweight, self.eventname, self.hitAnt
    

        

    def get_trace(self):
        _,_,_,_,_,nhits,_,eventname, hitAnt = event_instance.get_data()
        self.nhits = nhits
        self.eventname = eventname
        self.hitAnt = hitAnt
        lw = 1.5    # line-width of traces curves.
        alp = 0.9   # alpha on used color.
        antid = []
        tcurve_E = {}
        tcurve_h= {}
        peakA, peakT = np.zeros(self.nhits), np.zeros(self.nhits)
        for i, ant_id in enumerate(self.hitAnt):
            antid.append(ant_id)
            efield      = hdf5io.GetAntennaEfield(self.hdffile, self.eventname, ant_id,OutputFormat="numpy")
            efield[:,0]*= 1.e-9 #from ns to s. This is important for mix.filters(), if not error is produced.
            efield_filt = mix.filters(efield, FREQMIN=self.fmin, FREQMAX=self.fmax)
            hilbert_amp = np.abs(hilbert(efield_filt[1:4,:]))

            # traces of electric field along x, y and z axes       #xlim=(-1,len(efield[:,1])+1), ylim=(ymin,ymax)
            curveEx = efield[:,1]
            curveEy = efield[:,2]
            curveEz = efield[:,3]
            # convert these each component to array and save into tcurve
            tcurve_E[ant_id] = np.array([curveEx, curveEy, curveEz]).tolist()

            ymin = min([min(efield[:,1]), min(efield[:,2]), min(efield[:,3])])
            ymin = ymin - .05*abs(ymin)
            ymax = max([max(efield[:,1]), max(efield[:,2]), max(efield[:,3])])
            ymax = ymax + .05*abs(ymax)
          
            # hilbert transform
            curvexh = hilbert_amp[0,:]
            curveyh = hilbert_amp[1,:]
            curvezh = hilbert_amp[2,:]
            tcurve_h[ant_id] = np.array([curvexh, curveyh, curvezh]).tolist()

            ymin_h = min([min(hilbert_amp[0,:]), min(hilbert_amp[1,:]), min(hilbert_amp[2,:])])
            ymax_h = max([max(hilbert_amp[0,:]), max(hilbert_amp[1,:]), max(hilbert_amp[2,:])])
            ymin_h = ymin_h - .05*abs(ymax_h) # ymin is always 0.
            ymax_h = ymax_h + .05*abs(ymax_h)

            # to prevent from taking log on <1 numbers. Use any number >=1.
            self.trace_collection   = tcurve_E
            self.hilbert_collection = tcurve_h
        return antid, tcurve_E, tcurve_h

    def plot_text(self,data=[]):
		# Print basic shower information on the display.
		# To Do: Extend this to include experimental events.
        quantity = ['Particle','Ene [EeV]','Zen [deg]','Azi [deg]','BInc [deg]', 'BDec [deg]', 'Xmax [g/cm2]']
        value    = [  self.primary, 
	        		  round(self.energy,2),
	        		  round(np.rad2deg(self.zenith),2),
	        		  round(np.rad2deg(self.azimuth),2),
	                  round(np.rad2deg(self.bFieldIncl)-90.,2),
	                  round(-1*np.rad2deg(self.bFieldDecl),2),
	                  round(self.slant_xmax, 2)]
        text = {'Quantity': quantity, 'Value': value}
        return text

    class plot_data_to_json:
        def __init__(self, event_instance, savefiledir, geofile):
            self.event_instance = event_instance
            self.savefile_dir = savefiledir
            self.geofile_ = geofile

        def read_hitgeometry_to_json(self):
            hitx, hity, hitz, hitt, tbin, _, wts, _, _ = self.event_instance.get_data()
            hitX = hitx.tolist()
            hitY = hity.tolist()
            hitZ = np.round(hitz, decimals=5).tolist()
            hitT = hitt
            tbins = tbin
            wt = wts

            df = pd.read_csv(self.geofile_, delimiter=" ")
            df = df.drop(df.columns[0], axis=1)
            df['X'] = df["X"] / 1.e3
            df['Y'] = df["Y"] / 1.e3
            df['Z'] = df["Z"].astype(float).round(5)
            df1 = df.set_index('ID')
            geodata = df1.to_dict(orient="index")  #geodata
            geovalue = [{'X': j['X'], 'Y': j['Y'], 'Z': j['Z']} for i, j in geodata.items()]

            hitgeo = [{'X': hitX[i], 'Y': hitY[i], 'Z': hitZ[i]} for i in range(len(hitX))]
            modified_hit_geo_with_key = {list(geodata.keys())[i]: {"X": hitgeo[j]["X"], "Y": hitgeo[j]["Y"], "Z": hitgeo[j]["Z"]}
                                for i in range(len(geovalue)) for j in range(len(hitgeo))
                                if geovalue[i]['X'] == hitgeo[j]['X'] and geovalue[i]['Y'] == hitgeo[j]['Y']}
            
            wt = {}
            hitTs = {}
            tbins_ = {}
            for j in range(len(hitgeo)):
                for i in range(len(geovalue)):
                    if geovalue[i]['X'] == hitgeo[j]['X'] and geovalue[i]['Y'] == hitgeo[j]['Y']:
                        wt[i] = wts[j]
                        hitTs[i] = hitT[j]
                        tbins_[i] = tbins[j]
            rearranged_hit_information = {"hitXYZ":modified_hit_geo_with_key, "wt":wt, "hitT":hitTs, "tbins":tbins_}
            return rearranged_hit_information
    

        def get_electric_field_traces(self):
    # Retrieve traces from event_instance
            antid, tcurve_E, tcurve_h = self.event_instance.get_trace()
            
            jsonE_data = {}
            jsonh_data = {}

            # Iterate over each key in antid
            for i in antid:
                # Create DataFrame from tcurve_E[i] and tcurve_h[i]
                dfE = pd.DataFrame({"Ex": tcurve_E[i][0], "Ey": tcurve_E[i][1], "Ez": tcurve_E[i][2]})
                dfh = pd.DataFrame({"hx": tcurve_h[i][0], "hy": tcurve_h[i][1], "hz": tcurve_h[i][2]})
                
                # Convert DataFrame to JSON format
                jsonE_str = dfE.to_json(orient='records')
                jsonh_str = dfh.to_json(orient='records')
                
                # Store JSON string in the dictionary with key `i`
                jsonE_data[i] = json.loads(jsonE_str)
                jsonh_data[i] = json.loads(jsonh_str)
            
            # Prepare rearranged data dictionaries
            rearranged_Edata = {}
            rearranged_hdata = {}
            
            # Process jsonE_data to rearranged_Edata
            for key, values in jsonE_data.items():
                rearranged_Edata[key] = {
                    "Ex": [entry["Ex"] for entry in values],
                    "Ey": [entry["Ey"] for entry in values],
                    "Ez": [entry["Ez"] for entry in values]
                }
            
            # Process jsonh_data to rearranged_hdata
            for key, values in jsonh_data.items():
                rearranged_hdata[key] = {
                    "hx": [entry["hx"] for entry in values],
                    "hy": [entry["hy"] for entry in values],
                    "hz": [entry["hz"] for entry in values]
                }
            
            return rearranged_Edata, rearranged_hdata
        def merged_all_to_one(self):
            class NumpyEncoder(json.JSONEncoder):
                def default(self, obj):
                    if isinstance(obj, np.ndarray):
                        return obj.tolist()  # Convert NumPy array to Python list
                    elif isinstance(obj, np.float32):
                        return float(obj)  # Convert float32 to standard Python float
                    return json.JSONEncoder.default(self, obj)
                
            hitdatas = self.read_hitgeometry_to_json()
            Efielddatas, hfielddatas = self.get_electric_field_traces()
            plottxt = self.event_instance.plot_text()
            merged_one = {
                "hitgeo": hitdatas,
                "Efield": Efielddatas,
                "Hfield": hfielddatas,
                "textinform": plottxt
            }
            path_of_json = os.path.join(self.savefile_dir, "GP300_Proton_0.1_63.0_20.77_10.json")
            with open(path_of_json,'w') as f:
                json.dump(merged_one, f, indent=4, cls=NumpyEncoder)

if __name__ == '__main__':
    """
    python3 hdf5dat_to_json.py --datadir Datadir ,

    Datadir refers to full path of directory of your data
    """
    try:
        import pandas as pd
        import numpy as np
        import mix
        import hdf5fileinout as hdf5io 
        from bokeh.palettes import plasma
        from scipy.signal import hilbert
        import json
        color_pallette = plasma
        import sys
        import json
        import os
        import argparse
    except ImportError as e:
        print(f"Required module {e.name} not found. You can install it using 'pip install {e.name}'.")

    parser = argparse.ArgumentParser(description='Read data files and save to JSON')

    # Add a command-line argument for the input files
    parser.add_argument('--datadir', type=str, required=True, help='Paths to the input files (HDF5 and .dat)')
    
    # Parse the command-line arguments
    args = parser.parse_args()
    list_of_file = os.listdir(args.datadir)
    # Process each input file
    for file in list_of_file:
        # Determine the file type based on the file extension
        filepath = os.path.join(args.datadir, file)
        file_extension = filepath.rsplit('.', 1)[-1].lower()
        prefix_file = file.rsplit('.')[0]

        # Dispatch to appropriate function based on file type
        if file_extension == 'hdf5':
            hdffile = filepath
        elif file_extension == 'dat':
            geofiles = filepath
        else:
            print(f"Unsupported file type for {dir}: {file_extension}. Please provide an HDF5 or .dat file.")

    event_instance = event_3D_viewer(hdffile, geofiles)
    json_generator = event_instance.plot_data_to_json(event_instance, args.datadir, geofiles)
    json_generator.merged_all_to_one()
    
