# Tools4TSRE

### Project Overview

Tools4TSRE is a desktop application designed to simplify the creation of maps for the OpenRails train simulator. Developed using Tauri, the application leverages modern technologies to offer a lightweight and performant tool that facilitates the importation of geographic and topographic data into the Train Simulator Route Explorer \(TSRE\). The application supports the selection of specific geographic areas, seamless data integration, and offers a user-friendly interface tailored to both experienced and novice users of OpenRails.

### Features

- **Location Search:** Search for specific locations and navigate seamlessly across the map.
- **Interactive Map:** Move, zoom, and interact with the map using Leaflet.
- **Area Selection:** Select specific geographic areas directly on the map for data import.
- **Clear Selection:** Reset or change the selected area with ease.
- **Directory Selection:** Choose local directories for data storage.
- **Geographic Data Import:** Import geographic data into TSRE after selecting an area and directory.
- **Topographic Data Import:** Import topographic data into TSRE after selecting an area, directory, and logging into your USGS EarthExplorer account.
- **User Authentication:** Secure login and token management for accessing USGS EarthExplorer data.

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/SneakySnake993/Tools-for-TSRE.git
   ```

2. **Install Dependencies**
   Navigate to the project directory and install the necessary dependencies.
   ```bash
   cd Tools-for-TSRE
   ```
   ```bash
   npm install
   ```

3. **Build the Application**
   Compile and package the application using Tauri.
   ```bash
   npm run tauri build
   ```

4. **Run the Application**
   Launch the application in development mode.
   ```bash
   npm run tauri dev
   ```

### Usage

1. **Search for a Location:**
   Use the search bar to find and navigate to a specific location on the map.
   
2. **Select an Area:**
   Draw a rectangle on the map to select the area for which you want to import data.

3. **Choose a Directory:**
   Select the local directory where you want to save the imported data.

4. **Import Data:**
   - For geographic data, simply select the area and directory, and click on 'Import Geographic Data.'
   - For topographic data, ensure you are logged into your USGS EarthExplorer account, then proceed with the import.

5. **Manage Data:**
   Clear your selected area or change your directory as needed.

### Contributions

Contributions to the project are welcome! Feel free to submit issues, pull requests, or suggest new features.
