const installBtn = document.getElementById('buttonInstall');
const openBtn = document.getElementById('buttonOpen');
const textHeader = document.getElementById('textHeader');

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  installBtn.style.visibility = 'visible';
  textHeader.textContent = 'Click the button to install!';

  installBtn.addEventListener('click', () => {
    event.prompt();
    installBtn.setAttribute('disabled', true);
    installBtn.textContent = 'Installed!';
  });
});

window.addEventListener('appinstalled', (event) => {
    textHeader.textContent = 'Application has been successfully installed! Click the launch icon on the right side of the URL address bar to open the app!';
    installBtn.style.visibility = 'hidden';
    console.log('👍', 'appinstalled', event);
});

// Detect if the PWA is installed using getInstalledRelatedApps()
if (navigator.getInstalledRelatedApps) {
    console.log("found pwa");
    navigator.getInstalledRelatedApps().then((relatedApps) => {
      console.log("relatedApps: " + JSON.stringify(relatedApps));
      console.log("relatedApps.length: " + relatedApps.length);
      if (relatedApps.length > 0) {
        console.log("Set text to open");
        // The PWA is installed
        installBtn.textContent = 'Open';
      }
    });
  }