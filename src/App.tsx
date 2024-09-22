import './App.css';

import { useEffect, useState } from 'react';

type BoxProps = {
  value: number | null | undefined;
};

type RowProps = {
  values: (number | null | undefined)[] | undefined;
};

function Box({ value }: BoxProps) {
  return <div className="box">{value}</div>;
}

function Row({ values }: RowProps) {
  if (values !== undefined)
    return (
      <div className="row">
        <Box value={values[0]} /> <Box value={values[1]} />{' '}
        <Box value={values[2]} /> <Box value={values[3]} />
      </div>
    );
}

function Board() {
  const i1 = Math.floor(Math.random() * 4);
  const j1 = Math.floor(Math.random() * 4);
  let it, jt;
  do {
    it = Math.floor(Math.random() * 4);
    jt = Math.floor(Math.random() * 4);
  } while (it === i1 && jt === j1);
  const i2 = it,
    j2 = jt;

  const randomValue1 = Math.random() < 0.9 ? 2 : 4;
  const randomValue2 = Math.random() < 0.9 ? 2 : 4;
  const initArr: (number | null | undefined)[][] = [
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ];
  if (initArr[i1] !== undefined) initArr[i1][j1] = randomValue1;
  if (initArr[i2] !== undefined) initArr[i2][j2] = randomValue2;

  const [arr, setArr] = useState<(number | null | undefined)[][]>(initArr);

  /*
  const updateValue = () => {
    const newArr = arr.map(row => [...row]); 
    setArr(newArr); 
  };
  */

  useEffect(() => {
    const move = (direction: 'left' | 'right' | 'up' | 'down') => {
      let newArr = arr.map((row) => [...row]); // 배열 복사

      // 방향에 따라 배열 회전
      if (direction === 'right') {
        newArr = newArr.map((row) => row.reverse());
      } else if (direction === 'up' || direction === 'down') {
        if (newArr[0] !== undefined)
          newArr = newArr[0].map((_, colIndex) =>
            newArr.map((row) => row[colIndex]),
          );
        if (direction === 'down') {
          newArr = newArr.map((row) => row.reverse());
        }
      }

      // 각 행을 처리
      newArr = newArr.map((row) => {
        const filteredRow = row.filter(
          (num) => num !== null && num !== undefined,
        );
        const mergedRow: (number | null)[] = [];
        let skip = false;

        for (let i = 0; i < filteredRow.length; i++) {
          if (skip) {
            skip = false;
            continue;
          }

          const current = filteredRow[i];

          // 병합 조건
          if (i + 1 < filteredRow.length && current === filteredRow[i + 1]) {
            if (current !== undefined) mergedRow.push(current * 2);
            skip = true;
          } else {
            if (current !== undefined) mergedRow.push(current);
          }
        }

        // null로 패딩
        while (mergedRow.length < 4) {
          mergedRow.push(null);
        }

        return mergedRow;
      });

      // 다시 원래 방향으로 되돌리기
      if (direction === 'right') {
        newArr = newArr.map((row) => row.reverse());
      } else if (direction === 'up' || direction === 'down') {
        if (direction === 'down') {
          newArr = newArr.map((row) => row.reverse());
        }
        if (newArr[0] !== undefined)
          newArr = newArr[0].map((_, colIndex) =>
            newArr.map((row) => row[colIndex]),
          );
      }

      // 새로운 배열로 업데이트
      setArr(newArr);
    };

    const leftMove = () => {
      move('left');
    };

    const rightMove = () => {
      move('right');
    };

    const upMove = () => {
      move('up');
    };

    const downMove = () => {
      move('down');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.startsWith('Arrow')) {
        if (e.key === 'ArrowLeft') leftMove();
        if (e.key === 'ArrowRight') rightMove();
        if (e.key === 'ArrowUp') upMove();
        if (e.key === 'ArrowDown') downMove();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [arr]);

  return (
    <div className="board">
      <Row values={arr[0]} /> <Row values={arr[1]} /> <Row values={arr[2]} />{' '}
      <Row values={arr[3]} />
    </div>
  );
}

function App() {
  return (
    <div>
      <Board />
    </div>
  );
}

export default App;
