import pandas as pd
import numpy as np
import time
import plotly.graph_objects as go
import mix
import hdf5fileinout as hdf5io 
from bokeh.palettes import plasma
from scipy.signal import hilbert
from plotly.subplots import make_subplots


color_pallette = plasma

class event_3D_viewer:
    def __init__(self):
        self.hdffile = open("/home/shivaji/Documents/EventViewer/Data/GP300_Proton_0.1_63.0_20.77_10.hdf5",'rb')
        self.geofile = open("/home/shivaji/Documents/EventViewer/Data/GP300propsedLayout.dat", 'rb')
        self.tstep   = 1500   # time step to look for antennae begin hit. If this time is short, event formation on viewer will take longer.
        self.fmin    = 50.e6  # minimum radio frequency in hertz.
        self.fmax    = 200.e6
        self.geo_df  = pd.read_csv(self.geofile, sep=" ", usecols=[1,2,3,4])
        self.geo_df['ID'] = np.array([str(ant_name) for ant_name in self.geo_df['ID']])
    
    def get_geometry(self):
        self.posx  = self.geo_df['X']/1.e3   # x-coordinate of all antenna
        self.posy    = self.geo_df['Y']/1.e3     # y-coordinate of all antenna
        self.posz = self.geo_df['Z']/1.e3  # let's increase z data by 1
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
        return self.hitX, self.hitY, self.hitZ, self.hitT, self.tbins, self.nhits, self.Eweight, self.palette_color, self.eventname, self.hitAnt
    
    def get_trace(self):
        _,_,_,_,_,nhits,_,_, eventname, hitAnt = event_3D_viewer().get_data()
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
            
#lets call class and function
# call position of all antenna
X,Y,Z = event_3D_viewer().get_geometry()

# call all necessary data such as hitx, hity,etc
hitX, hitY, hitZ, hitT, tbins, nhits, wt, palette,_,_ = event_3D_viewer().get_data()

# using plotly
# create figure
fig = go.Figure()

# before hitting, lets plot all position of antenna 
def initial_trace():
    fig.add_trace(
        go.Scatter3d(
            x=X,
            y=Y,
            z=Z,
            mode = 'markers',
            marker = dict(
                size=5,
                color='#00ee2a',
                opacity = 0.9

            ),
            name='3D Position Antenna'
        ),
    )

    # lets plot projection of data on xy plane
    fig.add_trace(
        go.Scatter3d(
            x=X,
            y=Y,
            z=np.zeros(len(X)),
            mode = 'markers',
            marker = dict(
                size=2,
                color='blue',
                opacity = 0.2

            )
            
        )
    )

# for animation
def update_frame():
    frames = []
    current_size = np.zeros(len(X)) + 5  # Start with small size for all antennas
    indx = 0
    colors = ['black','red','blue', 'green', 'yellow', 'orange', 'purple']
    while indx<len(tbins): #i in range(num_hits):
        mask = hitT<=tbins[indx]
        t = np.array(hitT)[mask],
        #wt= [wts[j] for j in range(len(hitX)) if mask[j]],
        current_size = 5+2*np.log(wt)[mask]  # Calculate size based on intensity
        all_antenna_trace = go.Scatter3d(
                x=X,
                y=Y,
                z=Z,
                mode='markers',
                marker=dict(
                    size=5,
                    color='#00ee2a',
                    opacity=0.9,
                ),
                name='3D Position Antenna'
            )
        hit_trace = go.Scatter3d(
                x= np.array(hitX)[mask],
                y= np.array(hitY)[mask],
                z= np.array(hitZ)[mask],
                mode='markers',
                marker=dict(
                    size=current_size,  # Scale size based on intensity
                    color = [palette[j] for j in range(len(hitX)) if mask[j]],
                    opacity=1,
                    symbol='circle',
                ),
                name = 'Hit Antenna',
                #hovertemplate = {'x: %{x}', 'y:%{y}', 'z:%{z}', 't:%{t}'}
                hovertemplate=(
                'x: %{x:.2f}<br>'
                'y: %{y:.2f}<br>'
                'z: %{z:.2f}<br>'
                'time: %{text:.2f}<br>'
                'weight: %{marker.size:.4f}<extra></extra>'  # Display t and wt in hover
            ),
            text=np.array(hitT)[mask]
        )
                
        
        frame_data = [all_antenna_trace, hit_trace]

        frames.append(go.Frame(data=frame_data))#, name=f'frame_{i}'))

        # Pause briefly before showing the next hit antenna
        time.sleep(0.1)
        indx +=1

    return frames
initial_trace()
# Generate frames for animation
animation_frames = update_frame()
fig.add_trace(
        go.Scatter3d(
            x=X,
            y=Y,
            z=np.zeros(len(X)),
            mode = 'markers',
            marker = dict(
                size=3,
                color='blue',
                opacity = 0.2

            ),
            name = '2D position Antenna(z=0)'
        )
    )
# Add frames to animation
fig.frames = animation_frames

# Update layout for animatio
fig.update_layout(
    title='Sequential Visualization of Hit Antennas',
    scene=dict(
        xaxis=dict(title='X(Km)',visible=True, showticklabels=True),
        yaxis=dict(title='Y(Km)',visible=True, showticklabels=True),
        zaxis=dict(title='Z(Km)',visible=True, showticklabels=True),
        #bgcolor = '#151618',
        aspectmode='auto'
    ),
    margin=dict(l=50, r=50, t=50, b=50),  # Adjust these values to your preference
    width=1000,  # Total width of the plot
    height=600,
    template='seaborn',
    updatemenus=[
        {
            'buttons': [
                {
                    'args': [None, {'frame': {'duration': 1000, 'redraw': True}, 'fromcurrent': True}],
                    'label': 'Play',
                    'method': 'animate'
                }
            ],
            'direction': 'left',
            'pad': {'r': 10, 't': 50},
            'showactive': False,
            'type': 'buttons',
            'x': 0.02,
            'xanchor': 'left',
            'y': 1.09,
            'yanchor': 'top'
        }
    ]
)

fig.show()