import { save, open} from '@tauri-apps/api/dialog';
import { writeTextFile, writeBinaryFile, createDir, readTextFile, exists} from '@tauri-apps/api/fs';
import JSZip, { file } from 'jszip';
import { dialog } from '@tauri-apps/api';
import * as constant from '../constants';

// Function to save GPX data to a file
export async function saveGPXDataToFile(filePath, fileName, data) {
  try {
    if (filePath === '') {
      filePath = await save({
        defaultPath: fileName,
        filters: [{ name: 'GPX File', extensions: ['gpx'] }],
        title: 'Select Route Directory',
      });
    }

    if (!filePath) {
      throw new Error("UserCancelled");
    }

    await writeTextFile(filePath, data);

    return filePath;
  } catch (error) {
    if (error.message !== "UserCancelled") {
      dialog.message(constant.ERROR_MESSAGES.FAILED_TO_SAVE_GPX_FILE, { type: 'error' });
    }
    throw error;
  }
}

// Function to save HGT/DEM data to a file
export async function saveHGTDataToFile(dirTSREPath, fileName, data) {
  try {
    if(dirTSREPath === '') {
      dirTSREPath = await open({
        directory: true,  // This ensures the dialog selects a directory
        title: 'Select TSRE Directory',
      });
    }

    if (!dirTSREPath) {
      throw new Error("UserCancelled");
    }
    
    const zip = new JSZip();
    const zipContent = await zip.loadAsync(data);

    // 0 if there's only one file in the zip
    const zipFileName = Object.keys(zipContent.files)[0];
    const hgtData = await zipContent.file(zipFileName).async("uint8array");

    // Save the extracted HGT file
    /// Check if "/DEM" directory exists in the filePath
    const demDirectory = `${dirTSREPath}/DEM`;

    if (!(await exists(demDirectory))) {
      // Create the "/DEM" directory if it doesn't exist
      await createDir(demDirectory);
    }

    // Save the extracted HGT file in the "/DEM" directory
    const fullFilePath = `${demDirectory}/${fileName}`;
    await writeBinaryFile(fullFilePath, hgtData);

     // Update the settings.txt file
     const settingsFilePath = `${dirTSREPath}/settings.txt`;

     if (await exists(settingsFilePath)) {
       let settingsContent = await readTextFile(settingsFilePath);
       
       // Replace the geoPath line
       settingsContent = settingsContent.replace(/geoPath\s*=\s*.*/g, `geoPath = ${demDirectory}`);
       
       // Write the updated content back to the settings.txt file
       await writeTextFile(settingsFilePath, settingsContent);
     }

    return fullFilePath;
  } catch (error) {
    console.log(error);
    if (error.message !== "UserCancelled") {
      dialog.message(constant.ERROR_MESSAGES.FAILED_TO_SAVE_HGT_FILE, { type: 'error' });
    }
    throw error;
  }
}
