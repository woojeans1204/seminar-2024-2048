import { expect, test, vi } from 'vitest';

import { makeNewNumber } from './Board';

test('makeNewNumber adds a new number to an empty cell', () => {
  // 테스트용 초기 보드 설정
  const inputBoard = [
    [2, null, 2, null],
    [null, 4, null, 4],
    [2, null, 2, null],
    [null, 4, null, 4],
  ];

  // 빈 칸의 위치를 예측 가능하게 하기 위해 Math.random()을 모킹
  const mathRandomMock = vi.spyOn(Math, 'random');

  // 첫 번째 호출: 빈 칸 중 첫 번째를 선택하도록 설정
  mathRandomMock.mockReturnValueOnce(0 / 8); // 총 8개의 빈 칸 중 인덱스 0 선택

  // 두 번째 호출: 새로운 숫자로 2를 선택하도록 설정 (0.9 미만이면 2)
  mathRandomMock.mockReturnValueOnce(0.5); // 0.9보다 작으므로 2 선택

  // 함수 호출
  const outputBoard = makeNewNumber(inputBoard);

  // 기대되는 결과 보드 설정
  const expectedBoard = [
    [2, 2, 2, null],
    [null, 4, null, 4],
    [2, null, 2, null],
    [null, 4, null, 4],
  ];

  // 결과 검증
  expect(outputBoard).toEqual(expectedBoard);

  // 모킹된 Math.random() 복원
  mathRandomMock.mockRestore();
});
