import { getFilteredEvents } from '../../utils/eventUtils';
import { generateTestEvents } from '../utils';

describe('getFilteredEvents', () => {
  const events = generateTestEvents([
    {
      id: '0',
      title: '0번째',
      date: '2024-07-01',
    },
    {
      id: '1',
      title: '이벤트 1',
      date: '2024-07-02',
    },
    {
      id: '2',
      title: '이벤트 2',
      date: '2024-07-03',
    },
    {
      id: '3',
      title: '이벤트 3',
      date: '2024-07-21',
    },
    {
      id: '4',
      title: '이벤트 4',
      date: '2024-08-02',
    },
  ]);

  it("검색어 '이벤트 2'에 맞는 이벤트만 반환한다", () => {
    expect(getFilteredEvents(events, '이벤트 2', new Date('2024-07-01'), 'month')).toEqual([
      events[2],
    ]);
  });

  it('주간 뷰에서 2024-07-01 주의 이벤트만 반환한다', () => {
    expect(getFilteredEvents(events, '', new Date('2024-07-01'), 'week')).toEqual([
      events[0],
      events[1],
      events[2],
    ]);
  });

  it('월간 뷰에서 2024년 7월의 모든 이벤트를 반환한다', () => {
    expect(getFilteredEvents(events, '', new Date('2024-07-01'), 'month')).toEqual([
      events[0],
      events[1],
      events[2],
      events[3],
    ]);
  });

  it("검색어 '이벤트'와 주간 뷰 필터링을 동시에 적용한다", () => {
    expect(getFilteredEvents(events, '이벤트', new Date('2024-07-01'), 'week')).toEqual([
      events[1],
      events[2],
    ]);
  });

  it('검색어가 없을 때 모든 이벤트를 반환한다', () => {
    expect(getFilteredEvents(events, '', new Date('2024-07-01'), 'month')).toEqual([
      events[0],
      events[1],
      events[2],
      events[3],
    ]);
  });

  it('검색어가 대소문자를 구분하지 않고 작동한다', () => {
    const englishEvents = generateTestEvents([
      {
        id: '1',
        title: 'event 1',
        date: '2024-07-01',
      },
      {
        id: '2',
        title: 'Event 2',
        date: '2024-07-02',
      },
      {
        id: '3',
        title: 'EVENT 3',
        date: '2024-07-03',
      },
      {
        id: '4',
        title: 'ev 4',
        date: '2024-07-04',
      },
    ]);

    // 소문자 검색
    expect(getFilteredEvents(englishEvents, 'event', new Date('2024-07-01'), 'month')).toEqual([
      englishEvents[0],
      englishEvents[1],
      englishEvents[2],
    ]);

    // 카멜케이스 검색
    expect(getFilteredEvents(englishEvents, 'Event', new Date('2024-07-01'), 'month')).toEqual([
      englishEvents[0],
      englishEvents[1],
      englishEvents[2],
    ]);

    // 대문자 검색
    expect(getFilteredEvents(englishEvents, 'EVENT', new Date('2024-07-01'), 'month')).toEqual([
      englishEvents[0],
      englishEvents[1],
      englishEvents[2],
    ]);

    // 일부 문자 검색
    expect(getFilteredEvents(englishEvents, 'EV', new Date('2024-07-01'), 'month')).toEqual([
      englishEvents[0],
      englishEvents[1],
      englishEvents[2],
      englishEvents[3],
    ]);
  });

  it('월의 경계에 있는 이벤트를 올바르게 필터링한다', () => {
    const boundaryEvents = generateTestEvents([
      {
        id: '5',
        title: '7월 마지막 이벤트',
        date: '2024-07-31',
      },
      {
        id: '6',
        title: '8월 첫 이벤트',
        date: '2024-08-01',
      },
    ]);

    // 월간뷰에서 2024년 7월의 이벤트를 필터링하여 반환해야 한다.
    expect(getFilteredEvents(boundaryEvents, '', new Date('2024-07-1'), 'month')).toEqual([
      boundaryEvents[0], // 7월 31일
    ]);

    // 월간뷰에서 2024년 8월의 이벤트를 필터링하여 반환해야 한다.
    expect(getFilteredEvents(boundaryEvents, '', new Date('2024-08-1'), 'month')).toEqual([
      boundaryEvents[1], // 8월 1일
    ]);

    // 주간뷰에서 2024년 7월 마지막 주의 모든 이벤트를 반환해야 한다.
    expect(getFilteredEvents(boundaryEvents, '', new Date('2024-07-31'), 'week')).toEqual([
      boundaryEvents[0], // 7월 31일
      boundaryEvents[1], // 8월 1일
    ]);
  });

  it('빈 이벤트 리스트에 대해 빈 배열을 반환한다', () => {
    expect(getFilteredEvents([], '', new Date('2024-07-01'), 'month')).toEqual([]);
  });
});
