// 방법 1: 기본적인 소수 판별 함수 (초반에 사용)
// export const isPrime = (num: number) => {
//   if (num < 2) return false;
//   // 최적화: 제곱근까지만 검사
//   for (let i = 2; i * i <= num; i++) {
//     if (num % i === 0) return false;
//   }
//   return true;
// };

// 방법 2: 에라토스테네스의 체 (최종 최적화 버전)
export const findPrimes = (max: number) => {
  // 1. 모든 수를 일단 소수(true)라고 가정하고 배열 생성
  const sieve = new Array(max + 1).fill(true);
  
  // 0과 1은 소수가 아님
  sieve[0] = false;
  sieve[1] = false;

  // 2. 에라토스테네스의 체 알고리즘 적용
  for (let i = 2; i * i <= max; i++) {
    if (sieve[i]) {
      // i가 소수라면, i의 배수들은 모두 소수가 아님 (false 처리)
      for (let j = i * i; j <= max; j += i) {
        sieve[j] = false;
      }
    }
  }

  // 3. true인 인덱스(소수)만 필터링하여 반환
  return sieve
    .map((isPrime, index) => (isPrime ? index : null))
    .filter((number) => number !== null) as number[];
};