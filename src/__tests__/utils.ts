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

type BaseEvent = Pick<Event, 'id' | 'title' | 'date'>;
type OptionalEventProperties = Partial<
  Pick<
    Event,
    | 'startTime'
    | 'endTime'
    | 'description'
    | 'location'
    | 'category'
    | 'repeat'
    | 'notificationTime'
  >
>;

type TestEvent = BaseEvent & OptionalEventProperties;

export const generateTestEvent = ({
  id,
  title,
  date,
  startTime = '09:00',
  endTime = '10:00',
  description = '',
  location = '',
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
    description,
    location,
    category,
    repeat,
    notificationTime,
  };
};

export const generateTestEvents = (events: TestEvent[]): Event[] => {
  return events.map((event) => generateTestEvent(event));
};
