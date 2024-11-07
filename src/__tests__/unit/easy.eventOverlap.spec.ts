import {
  convertEventToDateRange,
  findOverlappingEvents,
  isOverlapping,
  parseDateTime,
} from '../../utils/eventOverlap';
import { generateTestEvent, generateTestEvents } from '../utils';

describe('parseDateTime', () => {
  it('2024-07-01 14:30을 정확한 Date 객체로 변환한다', () => {
    expect(parseDateTime('2024-07-01', '14:30')).toEqual(new Date('2024-07-01T14:30'));
  });

  it('잘못된 날짜 형식에 대해 Invalid Date를 반환한다', () => {
    expect(parseDateTime('2024-07-0221', '14:30')).toEqual(new Date(NaN));
  });

  it('잘못된 시간 형식에 대해 Invalid Date를 반환한다', () => {
    expect(parseDateTime('2024-07-01', '14:302')).toEqual(new Date(NaN));
  });

  it('날짜 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    expect(parseDateTime('', '14:30')).toEqual(new Date(NaN));
  });
});

describe('convertEventToDateRange', () => {
  it('일반적인 이벤트를 올바른 시작 및 종료 시간을 가진 객체로 변환한다', () => {
    expect(
      convertEventToDateRange(
        generateTestEvent({
          id: '1',
          title: '일반적인 이벤트',
          date: '2024-10-15',
          startTime: '09:00',
          endTime: '10:00',
        })
      )
    ).toEqual({
      start: new Date('2024-10-15T09:00'),
      end: new Date('2024-10-15T10:00'),
    });
  });

  it('잘못된 날짜 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const event = generateTestEvent({
      id: '1',
      title: '잘못된 날짜 이벤트',
      date: '2024-11-0', // 잘못된 날짜 형식
    });

    expect(convertEventToDateRange(event)).toEqual({ start: new Date(NaN), end: new Date(NaN) });
  });

  it('잘못된 시간 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const event = generateTestEvent({
      id: '2',
      title: '잘못된 시간 이벤트',
      date: '2024-11-1',
      startTime: '12:300', // 잘못된 시간 형식
      endTime: '13:30',
    });

    expect(convertEventToDateRange(event)).toEqual({
      start: new Date(NaN),
      end: new Date('2024-11-1T13:30'),
    });
  });
});

describe('isOverlapping', () => {
  const 기존이벤트 = generateTestEvent({
    id: '1',
    title: '기존 회의',
    date: '2024-10-15',
    startTime: '09:00',
    endTime: '10:00',
  });

  const 겹치는이벤트 = generateTestEvent({
    id: '2',
    title: '겹치는 회의',
    date: '2024-10-15',
    startTime: '09:30',
    endTime: '10:30',
  });

  const 안겹치는이벤트 = generateTestEvent({
    id: '3',
    title: '안 겹치는 회의',
    date: '2024-10-15',
    startTime: '10:00',
    endTime: '12:00',
  });

  it('두 이벤트가 겹치는 경우 true를 반환한다', () => {
    expect(isOverlapping(기존이벤트, 겹치는이벤트)).toBe(true);
  });

  it('두 이벤트가 겹치지 않는 경우 false를 반환한다', () => {
    expect(isOverlapping(기존이벤트, 안겹치는이벤트)).toBe(false);
  });
});

describe('findOverlappingEvents', () => {
  const 새로운이벤트 = generateTestEvent({
    id: '1',
    title: '새로운 회의',
    date: '2024-10-15',
    startTime: '09:00',
    endTime: '10:00',
  });

  const 안겹치는이벤트 = generateTestEvent({
    id: '2',
    title: '안 겹치는 회의',
    date: '2024-10-15',
    startTime: '13:00',
    endTime: '14:00',
  });

  const events = generateTestEvents([
    {
      id: '3',
      title: '겹치는 회의',
      date: '2024-10-15',
      startTime: '09:30',
      endTime: '10:30',
    },
    {
      id: '4',
      title: '또 겹치는 회의',
      date: '2024-10-15',
      startTime: '09:20',
      endTime: '09:50',
    },
    {
      id: '5',
      title: '계속 겹치는 회의',
      date: '2024-10-15',
      startTime: '08:30',
      endTime: '09:30',
    },
  ]);

  it('새 이벤트와 겹치는 모든 이벤트를 반환한다', () => {
    expect(findOverlappingEvents(새로운이벤트, events)).toEqual(events);
  });

  it('겹치는 이벤트가 없으면 빈 배열을 반환한다', () => {
    expect(findOverlappingEvents(안겹치는이벤트, events)).toEqual([]);
  });
});
