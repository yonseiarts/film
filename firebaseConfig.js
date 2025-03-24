<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>관리자 대시보드</title>
  
  <!-- Firebase SDK 모듈형 -->
  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
    import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
    import { getFirestore, collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
    
    // firebaseConfig.js 파일에서 Firebase 설정을 불러옵니다.
    import { firebaseConfig } from "./firebaseConfig.js";

    // Firebase 초기화
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
  </script>
  
  <!-- Tailwind CSS -->
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  
  <style>
    #debug-panel {
      position: fixed;
      bottom: 0;
      right: 0;
      width: 300px;
      max-height: 200px;
      overflow-y: auto;
      background: rgba(0,0,0,0.8);
      color: #00ff00;
      font-family: monospace;
      font-size: 12px;
      padding: 10px;
      z-index: 9999;
    }
    .hidden {
      display: none;
    }
  </style>
</head>

<body class="bg-gray-100 min-h-screen">
  <div class="max-w-6xl mx-auto p-4 sm:p-6">
    <header class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">🎬 관리자 대시보드</h1>
        <div id="auth-status"></div>
      </div>
    </header>

    <!-- 알림 및 오류 영역 -->
    <div id="notification-area" class="mb-6">
      <div id="loading-indicator" class="bg-blue-100 text-blue-700 p-4 rounded-lg shadow mb-2">
        데이터를 불러오는 중...
      </div>
      <div id="error-message" class="bg-red-100 text-red-700 p-4 rounded-lg shadow mb-2 hidden"></div>
      <div id="success-message" class="bg-green-100 text-green-700 p-4 rounded-lg shadow mb-2 hidden"></div>
    </div>

    <!-- 신청 목록 영역 -->
    <div id="application-list" class="space-y-4">
      <!-- 데이터가 여기에 표시됩니다 -->
    </div>
  </div>

  <!-- 디버그 패널 -->
  <div id="debug-panel" class="hidden">
    <div class="flex justify-between items-center mb-2">
      <h3>디버그 콘솔</h3>
      <button id="toggle-debug" class="text-xs bg-gray-700 text-white px-2 py-1 rounded">닫기</button>
    </div>
    <div id="debug-content"></div>
  </div>

  <script type="module">
    // =============== 디버그 유틸리티 ===============
    const DEBUG = true;
    const debugPanel = document.getElementById('debug-panel');
    const debugContent = document.getElementById('debug-content');
    
    if (DEBUG) {
      debugPanel.classList.remove('hidden');
      document.getElementById('toggle-debug').addEventListener('click', () => {
        debugContent.innerHTML = '';
        debugPanel.classList.toggle('hidden');
      });
    }
    
    function debug(message, type = 'info') {
      const timestamp = new Date().toLocaleTimeString();
      console.log(`[${timestamp}][${type.toUpperCase()}] ${message}`);
      
      if (DEBUG) {
        const color = type === 'error' ? 'red' : type === 'success' ? 'green' : 'white';
        debugContent.innerHTML += `<div style="color:${color}">[${timestamp}] ${message}</div>`;
        debugPanel.scrollTop = debugPanel.scrollHeight;
      }
    }

    // =============== UI 유틸리티 ===============
    function showLoading(show = true) {
      document.getElementById('loading-indicator').style.display = show ? 'block' : 'none';
    }
    
    function showError(message, autoHide = false) {
      const errorElement = document.getElementById('error-message');
      errorElement.textContent = message;
      errorElement.classList.remove('hidden');
      
      if (autoHide) {
        setTimeout(() => {
          errorElement.classList.add('hidden');
        }, 5000);
      }
    }
    
    function showSuccess(message, autoHide = true) {
      const successElement = document.getElementById('success-message');
      successElement.textContent = message;
      successElement.classList.remove('hidden');
      
      if (autoHide) {
        setTimeout(() => {
          successElement.classList.add('hidden');
        }, 3000);
      }
    }
    
    function clearMessages() {
      document.getElementById('error-message').classList.add('hidden');
      document.getElementById('success-message').classList.add('hidden');
    }

    // =============== 메인 애플리케이션 ===============
    document.addEventListener('DOMContentLoaded', function() {
      debug('페이지 로드됨');
      initializeApp();
    });

    async function initializeApp() {
      try {
        debug('애플리케이션 초기화 시작');
        
        // Firebase 설정
        const firebaseConfig = {
          apiKey: "AIzaSyDqGToBXgmqiOBMpFSkKZOtbo4o5sCNjuQ",
          authDomain: "yonseirent-setup.firebaseapp.com",
          projectId: "yonseirent-setup",
          storageBucket: "yonseirent-setup.appspot.com",
          messagingSenderId: "1072524969376",
          appId: "1:1072524969376:web:e23491a7196f97fd3e10c5",
          measurementId: "G-P61J7CYTWZ"
        };

        // Firebase 초기화 확인
        if (typeof firebase === 'undefined') {
          throw new Error('Firebase SDK가 로드되지 않았습니다.');
        }
        
        debug('Firebase SDK 로드됨');
        
        if (!firebase.apps.length) {
          firebase.initializeApp(firebaseConfig);
          debug('Firebase 초기화 완료');
        } else {
          debug('Firebase가 이미 초기화됨');
        }
        
        // Firestore 및 Auth 참조 생성
        window.db = firebase.firestore();
        window.auth = firebase.auth();
        
        debug('Firebase 서비스 참조 생성됨');
        
        // 인증 상태 변경 리스너 설정
        auth.onAuthStateChanged(handleAuthStateChanged);
        
      } catch (error) {
        debug(`초기화 오류: ${error.message}`, 'error');
        showError(`애플리케이션 초기화 실패: ${error.message}`);
      }
    }

    // 인증 상태 변경 처리
    function handleAuthStateChanged(user) {
      debug(`인증 상태 변경: ${user ? '로그인됨' : '로그인되지 않음'}`);
      updateAuthUI(user);
      
      if (user) {
        debug(`현재 사용자: ${user.email}`);
        loadApplicationData();
      } else {
        debug('인증되지 않은 사용자, 리디렉션 준비');
        document.getElementById('application-list').innerHTML = `
          <div class="bg-yellow-100 p-4 rounded-lg shadow">
            <p class="font-medium">로그인이 필요합니다.</p>
            <p class="mt-2">5초 후 로그인 페이지로 이동합니다...</p>
          </div>
        `;
        
        // 5초 후 로그인 페이지로 리디렉션
        setTimeout(() => {
          debug('로그인 페이지로 리디렉션');
          window.location.href = 'admin-login.html';
        }, 5000);
      }
    }

    // 인증 UI 업데이트
    function updateAuthUI(user) {
      const authStatus = document.getElementById('auth-status');
      
      if (user) {
        authStatus.innerHTML = `
          <div class="flex items-center">
            <span class="mr-4">${user.email}</span>
            <button id="logout-btn" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded">
              로그아웃
            </button>
          </div>
        `;
        
        document.getElementById('logout-btn').addEventListener('click', () => {
          auth.signOut()
            .then(() => {
              debug('로그아웃 성공');
              showSuccess('성공적으로 로그아웃되었습니다.');
            })
            .catch(error => {
              debug(`로그아웃 오류: ${error.message}`, 'error');
              showError(`로그아웃 실패: ${error.message}`);
            });
        });
      } else {
        authStatus.innerHTML = `
          <span class="text-red-600">로그인되지 않음</span>
        `;
      }
    }

    // 신청 데이터 로드
    function loadApplicationData() {
      debug('신청 데이터 로드 시작');
      showLoading(true);
      clearMessages();
      
      try {
        // 데이터 리스너 설정
        const unsubscribe = db.collection("applications")
          .orderBy("timestamp", "desc")
          .onSnapshot(handleDataSnapshot, handleDataError);
          
        // 나중에 리스너 해제가 필요한 경우 unsubscribe() 호출
        window.unsubscribeFromData = unsubscribe;
        
      } catch (error) {
        debug(`데이터 로드 오류: ${error.message}`, 'error');
        showLoading(false);
        showError(`데이터를 불러오는 중 오류가 발생했습니다: ${error.message}`);
        renderEmptyState(`오류: ${error.message}`);
      }
    }

    // 스냅샷 데이터 처리
    function handleDataSnapshot(snapshot) {
      debug(`데이터 스냅샷 수신: ${snapshot.size}개 항목`);
      showLoading(false);
      
      try {
        if (snapshot.empty) {
          debug('데이터 없음');
          renderEmptyState('등록된 신청 내역이 없습니다.');
          return;
        }
        
        renderApplicationList(snapshot);
        showSuccess(`${snapshot.size}개의 신청 내역을 불러왔습니다.`, true);
        
      } catch (error) {
        debug(`스냅샷 처리 오류: ${error.message}`, 'error');
        showError(`데이터 처리 중 오류가 발생했습니다: ${error.message}`);
      }
    }

    // 데이터 오류 처리
    function handleDataError(error) {
      debug(`Firestore 오류: ${error.message}`, 'error');
      showLoading(false);
      showError(`데이터베이스 오류: ${error.message}`);
      renderEmptyState(`데이터베이스 연결 오류가 발생했습니다.`);
    }

    // 빈 상태 렌더링
    function renderEmptyState(message) {
      const container = document.getElementById('application-list');
      container.innerHTML = `
        <div class="bg-gray-100 p-6 rounded-lg shadow text-center">
          <p class="text-gray-600">${message}</p>
        </div>
      `;
    }

    // 신청 목록 렌더링
    function renderApplicationList(snapshot) {
      const container = document.getElementById('application-list');
      container.innerHTML = '';
      
      snapshot.forEach(doc => {
        try {
          const data = doc.data();
          const card = createApplicationCard(doc.id, data);
          container.appendChild(card);
        } catch (error) {
          debug(`항목 렌더링 오류 (ID: ${doc.id}): ${error.message}`, 'error');
        }
      });
    }

    // 신청 카드 생성
    function createApplicationCard(docId, data) {
      const div = document.createElement('div');
      div.className = 'bg-white p-4 rounded-lg shadow';
      
      const statusClass = getStatusClass(data.status);
      
      // 타임스탬프 포맷팅
      let formattedDate = '날짜 정보 없음';
      if (data.timestamp && data.timestamp.toDate) {
        const date = data.timestamp.toDate();
        formattedDate = date.toLocaleString('ko-KR');
      }
      
      div.innerHTML = `
        <div class="flex justify-between items-start">
          <h2 class="text-lg font-bold">${data.name || '신청자 미입력'}</h2>
          <span class="px-2 py-1 rounded text-sm font-medium ${statusClass.bg} ${statusClass.text}">
            ${data.status || '대기중'}
          </span>
        </div>
        <div class="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <p class="text-sm text-gray-600">신청일시</p>
            <p class="font-medium">${formattedDate}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">대여일자</p>
            <p class="font-medium">${data.date || '-'}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">대여시간</p>
            <p class="font-medium">${data.time || '-'}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">장비</p>
            <p class="font-medium">${data.items?.join(", ") || '없음'}</p>
          </div>
        </div>
        <div class="mt-2">
          <p class="text-sm text-gray-600">증명사진</p>
          <p>${data.proofPhoto
            ? `<a href="${data.proofPhoto}" target="_blank" class="text-blue-600 underline">보기</a>`
            : '없음'}</p>
        </div>
        <div class="mt-4 flex space-x-2">
          <button class="approve-btn px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded" 
                  data-id="${docId}">승인</button>
          <button class="reject-btn px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded" 
                  data-id="${docId}">반려</button>
        </div>
      `;
      
      // 이벤트 리스너 추가
      const approveBtn = div.querySelector('.approve-btn');
      const rejectBtn = div.querySelector('.reject-btn');
      
      approveBtn.addEventListener('click', () => updateApplicationStatus(docId, '승인됨'));
      rejectBtn.addEventListener('click', () => updateApplicationStatus(docId, '반려됨'));
      
      return div;
    }

    // 상태 업데이트
    async function updateApplicationStatus(docId, newStatus) {
      debug(`상태 업데이트 시작: ID ${docId}, 새 상태 "${newStatus}"`);
      
      try {
        await db.collection("applications").doc(docId).update({
          status: newStatus,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        debug(`상태 업데이트 성공: ID ${docId}`, 'success');
        showSuccess(`성공적으로 상태가 업데이트되었습니다.`);
        
      } catch (error) {
        debug(`상태 업데이트 실패: ${error.message}`, 'error');
        showError(`상태 업데이트 실패: ${error.message}`);
      }
    }

    // 상태에 따른 스타일 클래스 반환
    function getStatusClass(status) {
      switch(status) {
        case '승인됨': 
          return { bg: 'bg-green-100', text: 'text-green-800' };
        case '반려됨': 
          return { bg: 'bg-red-100', text: 'text-red-800' };
        default: 
          return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
      }
    }
  </script>
</body>
</html>
