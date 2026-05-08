function CommunityGuid({ lang, navigateTo }) {
  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"}>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <span
            className="navbarbrand fw-bold"
            style={{ cursor: "pointer" }}
            onClick={() => navigateTo("appguid")}
          >
            ZEKRA
          </span>
          <button
            className="btn btn-outline-primary"
            onClick={() => navigateTo("appguid")}
          >
            {lang === "en" ? "Back to App Guide" : "العودة إلى دليل البرنامج"}
          </button>
        </div>
      </nav>

      <div className="container mt-3">
        <div className="card">
          <div className="card-body">
            <p className="descrip">
              {lang === "en" ? (
                <>
                  The Community is a dedicated group space designed exclusively for Alzheimer's patients to connect, communicate, and support one another in a safe and comfortable environment.<br /><br />

                  <strong>Messaging:</strong> You can send text messages to the group at any time, allowing everyone to stay in touch and share their thoughts or daily updates.<br /><br />

                  <strong>Media Sharing:</strong> The Community allows you to share images and videos with the group, making it easy to share memories, moments, or helpful content.<br /><br />

                  <strong>Voice Messages:</strong> If typing is difficult, you can hold the microphone button to record and send a voice message directly to the group.<br /><br />

                  <strong>Group Voice Call:</strong> You can start a group voice call with all community members under the name "Zekra Group", allowing everyone to speak and listen together in real time.<br /><br />

                  <strong>Group Video Call:</strong> A group video call is also available, letting members see and talk to each other face to face, which helps reduce feelings of isolation and strengthens the sense of belonging.<br /><br />

                  The Community feature is available only for patient accounts, ensuring a focused and supportive space tailored to their needs.
                </>
              ) : (
                <>
                  المجتمع هو مساحة جماعية مخصصة لمرضى الزهايمر للتواصل والتفاعل ودعم بعضهم البعض في بيئة آمنة ومريحة.<br /><br />

                  <strong>الرسائل النصية:</strong> يمكنك إرسال رسائل نصية للمجموعة في أي وقت، مما يتيح للجميع البقاء على تواصل ومشاركة أفكارهم أو تحديثاتهم اليومية.<br /><br />

                  <strong>مشاركة الوسائط:</strong> يتيح المجتمع مشاركة الصور والفيديوهات مع المجموعة، مما يسهّل تبادل الذكريات واللحظات أو المحتوى المفيد.<br /><br />

                  <strong>الرسائل الصوتية:</strong> إذا كان الكتابة صعبة، يمكنك الضغط مطولاً على زر الميكروفون لتسجيل وإرسال رسالة صوتية مباشرة للمجموعة.<br /><br />

                  <strong>المكالمة الصوتية الجماعية:</strong> يمكنك بدء مكالمة صوتية جماعية مع جميع أعضاء المجتمع تحت اسم "Zekra Group"، مما يتيح للجميع التحدث والاستماع معاً في الوقت الفعلي.<br /><br />

                  <strong>المكالمة المرئية الجماعية:</strong> تتوفر أيضاً مكالمة مرئية جماعية تتيح للأعضاء رؤية بعضهم والتحدث وجهاً لوجه، مما يساعد على تقليل الشعور بالعزلة وتعزيز الانتماء.<br /><br />

                  ميزة المجتمع متاحة فقط لحسابات المرضى، لضمان مساحة داعمة ومركّزة تلبي احتياجاتهم.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityGuid;
