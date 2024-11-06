import { Event } from '../types';
import { fillZero } from '../utils/dateUtils';

export const assertDate = (date1: Date, date2: Date) => {
  expect(date1.toISOString()).toBe(date2.toISOString());
};

export const parseHM = (timestamp: number) => {
  const date = new Date(timestamp);
  const h = fillZero(date.getHours());
  const m = fillZero(date.getMinutes());
  return `${h}:${m}`;
};

type BaseEvent = Pick<Event, 'id' | 'title' | 'date' | 'startTime' | 'endTime'>;
type OptionalEventProperties = Partial<
  Pick<Event, 'description' | 'location' | 'category' | 'repeat' | 'notificationTime'>
>;

type TestEvent = BaseEvent & OptionalEventProperties;

export const generateTestEvent = ({
  id,
  title,
  date,
  startTime,
  endTime,

  description,
  location,
  category = '업무',
  repeat = { type: 'none', interval: 0 },
  notificationTime = 10,
}: TestEvent): Event => {
  return {
    id,
    title,
    date,
    startTime,
    endTime,
    description: description ?? `이벤트 ${id} 입니다.`,
    location: location ?? `이벤트 ${id}의 장소`,
    category,
    repeat,
    notificationTime,
  };
};

export const generateTestEvents = (events: TestEvent[]): Event[] => {
  return events.map((event) => generateTestEvent(event));
};
