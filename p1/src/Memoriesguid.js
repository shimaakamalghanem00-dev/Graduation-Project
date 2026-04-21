function Memoriesguid({ lang, navigateTo }) {
  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"}>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <span className="navbarbrand fw-bold" style={{ cursor: 'pointer' }}    onClick={() => navigateTo("appguid")} >ZEKRA</span>
          <button 
            className="btn btn-outline-primary"
             onClick={() => navigateTo("appguid")}
          >
            {lang === "en" ? "Back to AppGuid" : "العودة الي دليل البرنامج"}
          </button>
        </div>
      </nav>

      <div className="container mt-3"> 
      <div class="card">
  <div class="card-body">
     <p className="descrip">
         The memories in our program are divided into three sections: photos, videos, and audio recordings.<br/>
         Program records the number of added images, videos, and audio recordings separately. <br/>
          </p>
  </div>
</div>
</div>


<div className="container mt-3"> 
      <div class="card">
  <div class="card-body">
     <p className="descrip">
          
          First, add Photos. When you click the "Add Photo" button, it takes you to another page where you can add a title and description for the Photo. For example, you can add the event the Photo is about and write a caption or something similar. Finally, upload the photo. To save, click the "Save photo" button, or if you want to undo, you can click the "Cancel" button.<br/>
          When you finish adding, it will show that it has been saved, then it will take you back to the Memories page again, and you will see that the number of photos has increased by one.<br/>
          </p>
  </div>
</div>
</div>
<div className="container mt-3"> 
      <div class="card">
  <div class="card-body">
     <p className="descrip">
         Second, regarding videos, you can add a video by clicking the "Add Video" button on the second card. This will take you to another page where you can add a title and description for the video, such as the event it's about or anything similar. Finally, to upload the video, click the "Upload Video" button. Once you're finished, click the "Save Video" button, or if you want to undo it, you can click the "Cancel" button. <br/>
         When you finish adding, it will show that it has been saved, then it will take you back to the Memories page again, and you will see that the number of videos has increased by one.<br/>
            </p>
  </div>
</div>
</div>

<div className="container mt-3"> 
      <div class="card">
  <div class="card-body">
     <p className="descrip">
        Third, adding an audio recording: You can add an Voice recording by first pressing the "Add Voice" button located on the third card. After pressing it, the program will take you to another page where you can add a title and a description for the recording, such as who you are talking about, your feelings about that person, or anything else. Then, to start recording, press the "Start Recording" button. When you finish, press the "Stop Recording" button. Two buttons will then appear: the first is the "Play" button if you want to hear what you said before saving, and the second is the "Record" button. This button cancels the previous recording and displays the "Start Recording" button again, and so on.<br/> 
        After that, when you're finished and want to save, just press the "Save Recording" button. If you want to undo it, press the "Cancel" button. After saving, the program will take you back to the Memories page, where you'll see that the number of recordings has been increased by one.  <br/> 
          </p>
  </div>
</div>
</div>
<div className="container mt-3"> 
      <div class="card">
  <div class="card-body">
     <p className="descrip">
          Finally, there is a button for all memories "View All Mermories". Clicking on it takes you to a page containing all the memories you have added, whether they are photos, videos, or even audio recordings.<br/>
          On this page you can search for a memory by its title, and you can also categorize the existing memories to display photos only by clicking the Photos button, videos only by clicking the Videos button, or recordings only by clicking the Voice button.
          </p>
  </div>
</div>
</div>
</div> 
  );
}

export default Memoriesguid;