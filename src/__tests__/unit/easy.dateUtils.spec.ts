// import { Event } from '../../types';
import {
  // fillZero,
  // formatDate,
  // formatMonth,
  // formatWeek,
  getDaysInMonth,
  getWeekDates,
} from '../../utils/dateUtils';

describe('getDaysInMonth', () => {
  it('1월은 31일 수를 반환한다', () => {
    expect(getDaysInMonth(2024, 1)).toBe(31);
  });

  it('4월은 30일 일수를 반환한다', () => {
    expect(getDaysInMonth(2024, 4)).toBe(30);
  });

  it('윤년의 2월에 대해 29일을 반환한다', () => {
    expect(getDaysInMonth(2024, 2)).toBe(29);
  });

  it('평년의 2월에 대해 28일을 반환한다', () => {
    expect(getDaysInMonth(2025, 2)).toBe(28);
  });

  it('유효하지 않은 월에 대해 적절히 처리한다', () => {
    const errorMessage = (month: number) =>
      `유효하지 않은 월입니다. month 값은 1에서 12 사이의 정수여야 합니다. 입력한 값: ${month}`;

    expect(() => getDaysInMonth(2024, 1.1)).toThrowError(errorMessage(1.1));
    expect(() => getDaysInMonth(2024, 13)).toThrowError(errorMessage(13));
    expect(() => getDaysInMonth(2024, 0)).toThrowError(errorMessage(0));
  });
});

describe('getWeekDates', () => {
  it('주중의 날짜(수요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const 수요일 = new Date('2024-11-6');
    const 주의날짜들 = [
      new Date('2024-11-3'), // 일
      new Date('2024-11-4'), // 월
      new Date('2024-11-5'), // 화
      new Date('2024-11-6'), // 수
      new Date('2024-11-7'), // 목
      new Date('2024-11-8'), // 금
      new Date('2024-11-9'), // 토
    ];

    expect(getWeekDates(수요일)).toEqual(주의날짜들);
  });

  it('주의 시작(일요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const 일요일 = new Date('2024-11-3');
    const 주의날짜들 = [
      new Date('2024-11-3'), // 일
      new Date('2024-11-4'), // 월
      new Date('2024-11-5'), // 화
      new Date('2024-11-6'), // 수
      new Date('2024-11-7'), // 목
      new Date('2024-11-8'), // 금
      new Date('2024-11-9'), // 토
    ];

    expect(getWeekDates(일요일)).toEqual(주의날짜들);
  });

  it('주의 끝(토요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const 토요일 = new Date('2024-11-9');
    const 주의날짜들 = [
      new Date('2024-11-3'), // 일
      new Date('2024-11-4'), // 월
      new Date('2024-11-5'), // 화
      new Date('2024-11-6'), // 수
      new Date('2024-11-7'), // 목
      new Date('2024-11-8'), // 금
      new Date('2024-11-9'), // 토
    ];

    expect(getWeekDates(토요일)).toEqual(주의날짜들);
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연말)', () => {
    const 연말 = new Date('2024-12-31');
    const 주의날짜들 = [
      new Date('2024-12-29'), // 일
      new Date('2024-12-30'), // 월
      new Date('2024-12-31'), // 화
      new Date('2025-1-1'), // 수
      new Date('2025-1-2'), // 목
      new Date('2025-1-3'), // 금
      new Date('2025-1-4'), // 토
    ];

    expect(getWeekDates(연말)).toEqual(주의날짜들);
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연초)', () => {
    const 연초 = new Date('2025-1-1');
    const 주의날짜들 = [
      new Date('2024-12-29'), // 일
      new Date('2024-12-30'), // 월
      new Date('2024-12-31'), // 화
      new Date('2025-1-1'), // 수
      new Date('2025-1-2'), // 목
      new Date('2025-1-3'), // 금
      new Date('2025-1-4'), // 토
    ];

    expect(getWeekDates(연초)).toEqual(주의날짜들);
  });

  it('윤년의 2월 29일을 포함한 주를 올바르게 처리한다', () => {
    const 윤년 = new Date('2024-2-29');
    const 주의날짜들 = [
      new Date('2024-2-25'), // 일
      new Date('2024-2-26'), // 월
      new Date('2024-2-27'), // 화
      new Date('2024-2-28'), // 수
      new Date('2024-2-29'), // 목
      new Date('2024-3-1'), // 금
      new Date('2024-3-2'), // 토
    ];

    expect(getWeekDates(윤년)).toEqual(주의날짜들);
  });

  it('월의 마지막 날짜를 포함한 주를 올바르게 처리한다', () => {
    const 월말 = new Date('2024-10-31');
    const 주의날짜들 = [
      new Date('2024-10-27'), // 일
      new Date('2024-10-28'), // 월
      new Date('2024-10-29'), // 화
      new Date('2024-10-30'), // 수
      new Date('2024-10-31'), // 목
      new Date('2024-11-1'), // 금
      new Date('2024-11-2'), // 토
    ];

    expect(getWeekDates(월말)).toEqual(주의날짜들);
  });
});

describe('getWeeksAtMonth', () => {
  it('2024년 7월 1일의 올바른 주 정보를 반환해야 한다', () => {});
});

describe('getEventsForDay', () => {
  it('특정 날짜(1일)에 해당하는 이벤트만 정확히 반환한다', () => {});

  it('해당 날짜에 이벤트가 없을 경우 빈 배열을 반환한다', () => {});

  it('날짜가 0일 경우 빈 배열을 반환한다', () => {});

  it('날짜가 32일 이상인 경우 빈 배열을 반환한다', () => {});
});

describe('formatWeek', () => {
  it('월의 중간 날짜에 대해 올바른 주 정보를 반환한다', () => {});

  it('월의 첫 주에 대해 올바른 주 정보를 반환한다', () => {});

  it('월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {});

  it('연도가 바뀌는 주에 대해 올바른 주 정보를 반환한다', () => {});

  it('윤년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {});

  it('평년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {});
});

describe('formatMonth', () => {
  it("2024년 7월 10일을 '2024년 7월'로 반환한다", () => {});
});

describe('isDateInRange', () => {
  const rangeStart = new Date('2024-07-01');
  const rangeEnd = new Date('2024-07-31');

  it('범위 내의 날짜 2024-07-10에 대해 true를 반환한다', () => {});

  it('범위의 시작일 2024-07-01에 대해 true를 반환한다', () => {});

  it('범위의 종료일 2024-07-31에 대해 true를 반환한다', () => {});

  it('범위 이전의 날짜 2024-06-30에 대해 false를 반환한다', () => {});

  it('범위 이후의 날짜 2024-08-01에 대해 false를 반환한다', () => {});

  it('시작일이 종료일보다 늦은 경우 모든 날짜에 대해 false를 반환한다', () => {});
});

describe('fillZero', () => {
  test("5를 2자리로 변환하면 '05'를 반환한다", () => {});

  test("10을 2자리로 변환하면 '10'을 반환한다", () => {});

  test("3을 3자리로 변환하면 '003'을 반환한다", () => {});

  test("100을 2자리로 변환하면 '100'을 반환한다", () => {});

  test("0을 2자리로 변환하면 '00'을 반환한다", () => {});

  test("1을 5자리로 변환하면 '00001'을 반환한다", () => {});

  test("소수점이 있는 3.14를 5자리로 변환하면 '03.14'를 반환한다", () => {});

  test('size 파라미터를 생략하면 기본값 2를 사용한다', () => {});

  test('value가 지정된 size보다 큰 자릿수를 가지면 원래 값을 그대로 반환한다', () => {});
});

describe('formatDate', () => {
  it('날짜를 YYYY-MM-DD 형식으로 포맷팅한다', () => {});

  it('day 파라미터가 제공되면 해당 일자로 포맷팅한다', () => {});

  it('월이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {});

  it('일이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {});
});
