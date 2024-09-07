export function resetVisitCountAtMidnight() {
  const now = new Date();
  const millisecondsUntilMidnight =
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0) - now;

  setTimeout(() => {
    localStorage.removeItem('lastVisitDate');
    resetVisitCountAtMidnight(); // 다음 날 00시에 다시 실행
  }, millisecondsUntilMidnight);
}
