# Project: 3D Interactive EventViewer for Giant Radio Array for Neutrino Detection

## Author

Shivaji Chaulagain

## Description

This project visualizes data from the Giant Radio Array for Neutrino Detection (GRAND) experiment in a 3D interactive format. It allows users to explore particle interactions and gain insights into neutrino detection.

## Getting Started

### Prerequisites

A web browser that supports WebGL (most modern browsers do). Require internet connection
### Running the Project

Clone or download the project repository.
Open Event_3D_viewer.html in your web browser.
For your own GRAND data:
Convert your HDF5 data to JSON using the hdf5_to_json_converter folder (instructions provided there).
Upload the converted JSON file.

*For the sample data:
Use the sample JSON file already provided in the Data folder.
### Note:

For local execution, ensure all project files are within the same folder.

## Project Structure

Data: Stores the sample hdf5, dat and JSON file for visualization.
hdf5_to_json_converter: Contains scripts for converting GRAND HDF5 data to JSON .
src: Houses JavaScript files for core functionality, including antenna geometry and color palettes.
Event_3D_viewer.html: The main HTML file that opens the visualization in your browser.

## Customization

The project currently focuses on functionality over aesthetics. You can improve the visual appeal by adding CSS styles to the Event_3D_viewer.html file.

## Known Issues

The order of updating hit points might require correction for optimal visualization.

## Contact

Feel free to reach out to the project author for any questions or contributions.
