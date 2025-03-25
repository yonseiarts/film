<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>연세예술원 영화학 기자재 대여</title>
  <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js"></script>
</head>
<body>
  <h1>Firebase 초기화 완료 페이지</h1>
  <script>
    // Firebase 설정
    const firebaseConfig = {
      apiKey: "AIzaSyDqGToBXgmqiOBMpFSkKZOtbo4o5sCNjuQ",
      authDomain: "yonseirent-setup.firebaseapp.com",
      projectId: "yonseirent-setup",
      storageBucket: "yonseirent-setup.appspot.com",
      messagingSenderId: "1072524969376",
      appId: "1:1072524969376:web:e23491a7196f97fd3e10c5",
      measurementId: "G-8G1D43NXMW"
    };

    // Firebase 초기화
    const app = firebase.initializeApp(firebaseConfig);

    // Firebase 인증 및 Firestore 초기화
    const auth = firebase.auth();
    const db = firebase.firestore();

    console.log("Firebase 초기화 완료");
  </script>
</body>
</html>
