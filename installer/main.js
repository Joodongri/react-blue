const electron = require("electron");
const path = require("path");
const url = require("url");
const isMac = process.platform === 'darwin';
const isDev = process.env.NODE_ENV === 'development';

const { app, BrowserWindow, Menu, shell } = electron;

let mainWindow;

const template = [
  ...(isMac ? [{
    label: 'React Blue',
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  {
    label: 'File',
    submenu: [
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'delete' },
      { role: 'selectall' },
    ],
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
    ],
  },
  {
    role: 'window',
    submenu: [
      { role: 'minimize' }, 
      { role: 'close' }],
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click() {
          shell.openExternal('https://github.com/team-targaryan/react-blue');
        },
      },
    ],
  },
  ...(isDev ? [{
    label: 'Developer',
    submenu: [
      {
        label: 'Toggle Developer Tools',
        accelerator: isMac ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click() {
          mainWindow.webContents.toggleDevTools();
        },
      },
    ],
  }] : [])
];

const createWindow = () => {
  const { width, height } = require("electron").screen.getPrimaryDisplay().size;
  mainWindow = new BrowserWindow({
    width,
    height,
    minWidth: 800,
    minHeight: 600,
    show: false,
    titleBarStyle: 'hidden'
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../client/assets/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  const mainMenu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(mainMenu);

  mainWindow.on('closed', () => {
    mainWindow = null;
  })
}

app.on('ready', function() {
  createWindow();
});