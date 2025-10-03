interface RouteData {
    title: string;
    content: string; 
}

const getPageContent = (path: string): RouteData => {
    switch (path) {
        case '/':
            return {
                title: '홈 ',
                content: '<div class="p-6 border-l-4 border-blue-500 bg-blue-50"><h2 class="text-3xl font-extrabold text-blue-800">🏡 홈 대시보드</h2><p class="mt-2 text-blue-700">새로운 구조로 더욱 깔끔해졌습니다.</p></div>'
            };
        case '/data':
            return {
                title: '데이터',
                content: '<div class="p-6 border-l-4 border-green-500 bg-green-50"><h2 class="text-3xl font-extrabold text-green-800">📊 데이터 분석</h2><p class="mt-2 text-green-700">함수를 통해 콘텐츠를 동적으로 생성합니다.</p></div>'
            };
        case '/settings':
            return {
                title: '설정 ',
                content: '<div class="p-6 border-l-4 border-purple-500 bg-purple-50"><h2 class="text-3xl font-extrabold text-purple-800">⚙️ 사용자 설정</h2><p class="mt-2 text-purple-700">페이지별 설정 정보를 여기서 관리합니다.</p></div>'
            };
        default:
            return {
                title: '404',
                content: '<div class="p-6 border-l-4 border-red-500 bg-red-50"><h2 class="text-4xl font-extrabold text-red-800">❌ 404 Error</h2><p class="mt-2 text-red-700">요청하신 경로를 찾을 수 없습니다.</p></div>'
            };
    }
};

const app = document.getElementById('app') as HTMLElement | null;
const router = (): void => {
    if (!app) return;
    const path: string = window.location.pathname;
    const route: RouteData = getPageContent(path);

    document.title = route.title;
    app.innerHTML = route.content;
    
    document.querySelectorAll('.route-link').forEach(link => {
        const linkElement = link as HTMLAnchorElement;
        linkElement.classList.remove('bg-gray-200');
        if (linkElement.getAttribute('data-path') === path) {
            linkElement.classList.add('bg-gray-200'); 
        }
    });
};

document.addEventListener("DOMContentLoaded", (): void => {
   document.querySelectorAll('.route-link').forEach((link) => {
    (link as HTMLAnchorElement).addEventListener("click", (e: MouseEvent) => {

        const target = e.currentTarget as HTMLAnchorElement;
        const newPath: string = target.getAttribute('data-path') || '/';

        history.pushState(null, '', newPath); 
        router();
    });
});
    
    window.addEventListener("popstate", router);

    router();
});