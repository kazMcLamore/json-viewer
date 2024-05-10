// class with static methods to address the FileMaker database
class Fm {
  static callbackScript = 'callback (jsb)';
  static scriptOptions = {
    Continue: '0',
    Halt: '1',
    Exit: '2',
    Resume: '3',
    Pause: '4',
    Suspend: '5',
  };

  static logging = true;

  // static method to call a FileMaker script and return a result asynchroniously
  static callback(options) {

    const {
      script,
      params,
      scriptOption = Fm.scriptOptions.Suspend,
      webviewerName,
      performOnServer = false,
    } = options;

    if (!script) {
      console.error('No script provided');
      return new Promise((resolve, reject) => {
        reject('No script provided');
      });
    } else if (!webviewerName) {
      console.error('No webviewer name provided');
      return new Promise((resolve, reject) => {
        reject('No webviewer name provided');
      });
    }

    return new Promise((resolve, reject) => {
      // retry the call if the FileMaker object is not found
      if (typeof FileMaker == 'undefined') {
        setTimeout(() => {
          Fm.callback(options).then(resolve).catch(reject);
        }, 1000);
        return;
      }

      // create a unique function name
      const functionName = `callbackFunction${Date.now()}`;

      // create a function on the window object with the unique name
      window[functionName] = function (result, parameter, error) {
        // remove the function from the window object
        delete window[functionName];

        // parse the result and error
        let resultParsed, errorParsed;
        if (result) {
          resultParsed = JSON.parse(result);
        }
        if (error) {
          errorParsed = JSON.parse(error);
        }

        if (Fm.logging) {
          console.log('callback', resultParsed, errorParsed);
        }

        // resolve or reject the promise based upon the result
        if (errorParsed.error_code || errorParsed?.error?.code) {
          reject(errorParsed);
        } else {
          resolve(resultParsed);
        }
      };

      // call the FileMaker script with the unique function name
      const callbackParameters = {
        script,
        params,
        callbackName: functionName,
        webviewerName,
        performOnServer,
      };

      if (typeof FileMaker == 'undefined') {
        console.error('FileMaker object not found');
        return;
      }

      // call the script
      FileMaker.PerformScriptWithOption(
        Fm.callbackScript, // call the callback bridge script
        JSON.stringify(callbackParameters), // w/ the parameters as text
        scriptOption, // and the script option
      );

      return;
    });
  }
}

export { Fm };
