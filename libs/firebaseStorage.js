import firebase from 'firebase/app';
import 'firebase/storage';

var storageRef = firebase.storage().ref();

export const customRequest = (folder = 'files', storyId, itemId, userId) => (
  options,
) => {
  const file = options.file;

  var metadata = {
    contentType: file.type,
  };

  const path =
    folder + '/' + storyId + '/' + itemId + '/' + userId + '/' + file.name;

  console.log('path', path);

  var uploadTask = storageRef.child(path).put(file, metadata);

  uploadTask.on(
    'state_changed',
    function (snapshot) {
      // console.log('snapshot', snapshot);

      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      // console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          // console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          // console.log('Upload is running');
          break;
      }

      const e = new ProgressEvent(snapshot.state, {
        lengthComputable: true,
        loaded: snapshot.bytesTransferred,
        total: snapshot.totalBytes,
      });

      if (e.total > 0) {
        e.percent = (e.loaded / e.total) * 100;
      }

      options.onProgress(e);
    },
    function (error) {
      console.log('error', error);
      options.onError(error); // added this line
    },
    function () {
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        console.log('File available at', downloadURL);
        options.onSuccess(downloadURL); // added this line
      });
    },
  );

  return {
    abort() {
      uploadTask.cancel();
    },
  };
};
