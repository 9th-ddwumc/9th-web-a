// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 요소 선택
    const hamburgerMenu = document.querySelector('.hamburger_menu');
    const navContainer = document.querySelector('.nav_container');
    const navItems = document.querySelectorAll('.nav_menu li');

    // 햄버거 버튼, X 버튼 클릭 이벤트
    hamburgerMenu.addEventListener('click', function() {
        const isOpen = navContainer.classList.contains('open');
        
        if (isOpen) {
            // 사이드바가 열려있으면 닫기
            navContainer.classList.remove('open');
            hamburgerMenu.classList.remove('active');
            hamburgerMenu.innerHTML = '☰'; // 햄버거 버튼으로 변경
        } else {
            // 사이드바가 닫혀있으면 열기
            navContainer.classList.add('open');
            hamburgerMenu.classList.add('active');
            hamburgerMenu.innerHTML = '×'; // X 버튼으로 변경
        }
    });

    // 네비게이션 바 메뉴 클릭 이벤트
    navItems.forEach(function(item) {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            
            // 모든 메뉴에서 active 클래스 제거
            navItems.forEach(function(navItem) {
                navItem.classList.remove('active');
            });
            
            // 클릭된 메뉴에 active 클래스 추가
            this.classList.add('active');
            
            // 모바일에서 메뉴 선택 후 사이드바 닫기 및 햄버거 버튼 복원
            if (window.innerWidth < 640) {
                navContainer.classList.remove('open');
                hamburgerMenu.classList.remove('active');
                hamburgerMenu.innerHTML = '☰'; // 햄버거 버튼으로 변경
            }
        });
    });

    // 화면 크기 변경 시 사이드바 상태 초기화
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 640) {
            navContainer.classList.remove('open');
            hamburgerMenu.classList.remove('active');
            hamburgerMenu.innerHTML = '☰'; // 햄버거 버튼으로 변경
        }
    });
});