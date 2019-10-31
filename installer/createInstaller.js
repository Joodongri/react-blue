const { createWindowsInstaller } = require('electron-winstaller');
const path = require('path');

getInstallerConfig()
    .then(createWindowsInstaller)
    .catch(error => {
        console.error(error.message || error);
        process.exit(1);
    })

function getInstallerConfig() {
    return Promise.resolve({
        appDirectory: path.join(__dirname, '../release-builds/React\ Blue-win32-ia32/'),
        authors: 'Darren Zhu, Kendall Lu, Krystal Chen, Randy Reyes',
        noMsi: true,
        outputDirectory: path.join(__dirname, '../release-builds/windows-installer/'),
        exe: 'React\ Blue.exe',
        setupExe: 'ReactBlueInstaller.exe',
        setupIcon: path.join(__dirname, '../client/assets/icons/win/icon.ico')
    })
}
