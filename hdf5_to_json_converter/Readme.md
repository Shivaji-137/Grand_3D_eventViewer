##  hdf5reader_to_json.py, for converting hdf5 to json file, a code by Shivaji Chaulagain
### HDF5 file should be intially converted to json file to view 3D
### To use:
From this directory, Open command prompt or terminal:

    python hdf5reader_to_json.py --datadir <fullpathfile_of_directory_where_your_data_folder_is>

    for example:
         python hdf5reader_to_json.py --datadir ../Data/

    *Note: While converting to json file, Data folder/directory should have only one .dat and hdf5 file: antenna geometry .dat files and required hdf5 file. if antenna geometry is stored in .csv, please change the file extension condition in hdf5reader_to_json.py python file accordingly. After changing to .csv extension condition, everything works

* hdf5fileinout.py, mix.py and .dat, hdf5 file are used from https://github.com/rameshkoirala/EventViewer
