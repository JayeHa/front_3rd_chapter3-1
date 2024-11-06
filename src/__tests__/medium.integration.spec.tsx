import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, within } from '@testing-library/react';
import { UserEvent, userEvent } from '@testing-library/user-event';

import {
  setupMockHandlerCreation,
  setupMockHandlerDeletion,
  setupMockHandlerUpdating,
} from '../__mocks__/handlersUtils';
import App from '../App';
import { Event } from '../types';
import { generateTestEvent, generateTestEvents } from './utils';

beforeAll(() => {
  vi.useFakeTimers();
});

beforeEach(() => {
  vi.setSystemTime(new Date('2024-10-15T09:00'));
});

afterAll(() => {
  vi.useRealTimers();
});

const setup = () => {
  const user = userEvent.setup();

  return {
    ...render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    ),
    user,
  }; // ? Medium: 여기서 ChakraProvider로 묶어주는 동작은 의미있을까요? 있다면 어떤 의미일까요?
};

// ! HINT. 이 유틸을 사용해 일정을 저장해보세요.
const saveSchedule = async (
  user: UserEvent,
  form: Omit<Event, 'id' | 'notificationTime' | 'repeat'>,
  isEdit?: boolean
) => {
  const { title, date, startTime, endTime, location, description, category } = form;

  await user.click(screen.getAllByText(isEdit ? '일정 수정' : '일정 추가')[0]);

  await user.clear(screen.getByLabelText('제목'));
  await user.type(screen.getByLabelText('제목'), title);

  await user.clear(screen.getByLabelText('날짜'));
  await user.type(screen.getByLabelText('날짜'), date);

  await user.clear(screen.getByLabelText('시작 시간'));
  await user.type(screen.getByLabelText('시작 시간'), startTime);

  await user.clear(screen.getByLabelText('종료 시간'));
  await user.type(screen.getByLabelText('종료 시간'), endTime);

  await user.clear(screen.getByLabelText('설명'));
  await user.type(screen.getByLabelText('설명'), description);

  await user.clear(screen.getByLabelText('위치'));
  await user.type(screen.getByLabelText('위치'), location);

  await user.selectOptions(screen.getByLabelText('카테고리'), category);
  await user.click(screen.getByTestId('event-submit-button'));
};

// ! HINT. "검색 결과가 없습니다"는 초기에 노출되는데요. 그럼 검증하고자 하는 액션이 실행되기 전에 검증해버리지 않을까요? 이 테스트를 신뢰성있게 만드려면 어떻게 할까요?
describe('일정 CRUD 및 기본 기능', () => {
  it('입력한 새로운 일정 정보에 맞춰 모든 필드가 이벤트 리스트에 정확히 저장된다.', async () => {
    // ! HINT. event를 추가 제거하고 저장하는 로직을 잘 살펴보고, 만약 그대로 구현한다면 어떤 문제가 있을 지 고민해보세요.
    setupMockHandlerCreation();
    const { user, getByTestId } = setup();

    const newEvent = generateTestEvent({
      id: '1',
      title: '팀 회의',
      date: '2024-10-15',
      description: '팀 회의에 대한 설명',
      location: '회의실',
    });

    await saveSchedule(user, newEvent);

    const eventList = getByTestId('event-list');
    expect(within(eventList).getByText(newEvent.title)).toBeInTheDocument();
  });

  it('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영된다', async () => {
    setupMockHandlerUpdating();
    const { user, getByTestId, findByTestId } = setup();

    const eventItem = await findByTestId('event-item-1');
    const $editButton = eventItem.querySelector('[aria-label="Edit event"]');
    await userEvent.click($editButton!);

    const newEvent = generateTestEvent({
      id: '1',
      title: '새로운 회의',
      date: '2024-10-15',
      description: '새로운 팀 미팅',
      location: '회의실',
    });

    await saveSchedule(user, newEvent, true);

    const eventList = getByTestId('event-list');
    expect(within(eventList).getByText('새로운 회의')).toBeInTheDocument();
  });

  it('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {
    setupMockHandlerDeletion();
    const { findByTestId } = setup();

    const eventList = await findByTestId('event-list');
    expect(within(eventList).getByText('삭제할 이벤트')).toBeInTheDocument();

    const eventItem = await findByTestId('event-item-1');
    const $deleteButton = eventItem.querySelector('[aria-label="Delete event"]');
    await userEvent.click($deleteButton!);

    expect(within(eventList).queryByText('삭제할 이벤트')).not.toBeInTheDocument();
  });
});

describe('일정 뷰', () => {
  it('주별 뷰를 선택 후 해당 주에 일정이 없으면, 일정이 표시되지 않는다.', async () => {
    const initEvents = [
      {
        id: '1',
        title: '팀 회의',
        date: '2024-10-30',
      },
    ];

    setupMockHandlerCreation(generateTestEvents(initEvents));
    const { user, findByTestId } = setup();

    const eventList = await findByTestId('event-list');
    expect(within(eventList).getByText(initEvents[0].title)).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('view'), 'week');
    expect(within(eventList).queryByText(initEvents[0].title)).not.toBeInTheDocument();
  });

  it('주별 뷰 선택 후 해당 일자에 일정이 존재한다면 해당 일정이 정확히 표시된다', async () => {
    const initEvents = [
      {
        id: '1',
        title: '팀 회의',
        date: '2024-10-15',
      },
    ];

    setupMockHandlerCreation(generateTestEvents(initEvents));
    const { user, findByTestId } = setup();

    const eventList = await findByTestId('event-list');
    expect(within(eventList).getByText(initEvents[0].title)).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('view'), 'week');
    expect(within(eventList).getByText(initEvents[0].title)).toBeInTheDocument();
  });

  it('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {
    const initEvents = [
      {
        id: '1',
        title: '팀 회의',
        date: '2024-11-01',
      },
    ];

    setupMockHandlerCreation(generateTestEvents(initEvents));
    const { findByTestId } = setup();

    const eventList = await findByTestId('event-list');
    expect(within(eventList).queryByText(initEvents[0].title)).not.toBeInTheDocument();
  });

  it('월별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
    const initEvents = [
      {
        id: '1',
        title: '팀 회의',
        date: '2024-10-30',
      },
    ];

    setupMockHandlerCreation(generateTestEvents(initEvents));
    const { findByTestId } = setup();

    const eventList = await findByTestId('event-list');
    expect(within(eventList).getByText(initEvents[0].title)).toBeInTheDocument();
  });

  it('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', async () => {
    vi.setSystemTime(new Date('2024-01-01'));
    setupMockHandlerCreation();
    const { container } = setup();

    expect(within(container).getByText('신정')).toBeInTheDocument();
  });
});

describe('검색 기능', () => {
  it('검색 결과가 없으면, "검색 결과가 없습니다."가 표시되어야 한다.', async () => {
    const initEvents = [
      {
        id: '1',
        title: '팀 회의',
        date: '2024-10-30',
      },
    ];

    setupMockHandlerCreation(generateTestEvents(initEvents));
    const { user, getByPlaceholderText, findByTestId } = setup();

    await user.type(getByPlaceholderText('검색어를 입력하세요'), '잘못된 검색어');
    const eventList = await findByTestId('event-list');

    expect(within(eventList).getByText('검색 결과가 없습니다.')).toBeInTheDocument();
  });

  it("'팀 회의'를 검색하면 해당 제목을 가진 일정이 리스트에 노출된다", async () => {
    const initEvents = [
      {
        id: '1',
        title: '팀 회의',
        date: '2024-10-30',
      },
      {
        id: '1',
        title: '점심 식사',
        date: '2024-10-30',
      },
    ];

    setupMockHandlerCreation(generateTestEvents(initEvents));
    const { user, getByPlaceholderText, findByTestId } = setup();

    await user.type(getByPlaceholderText('검색어를 입력하세요'), '팀 회의');
    const eventList = await findByTestId('event-list');

    expect(within(eventList).getByText('팀 회의')).toBeInTheDocument();
    expect(within(eventList).queryByText('점심 식사')).not.toBeInTheDocument();
  });

  it('검색어를 지우면 모든 일정이 다시 표시되어야 한다', async () => {
    const initEvents = [
      {
        id: '1',
        title: '팀 회의',
        date: '2024-10-30',
      },
      {
        id: '1',
        title: '점심 식사',
        date: '2024-10-30',
      },
    ];

    setupMockHandlerCreation(generateTestEvents(initEvents));
    const { user, getByPlaceholderText, findByTestId } = setup();

    await user.type(getByPlaceholderText('검색어를 입력하세요'), '팀 회의');
    const eventList = await findByTestId('event-list');

    expect(within(eventList).getByText('팀 회의')).toBeInTheDocument();
    expect(within(eventList).queryByText('점심 식사')).not.toBeInTheDocument();

    await user.clear(getByPlaceholderText('검색어를 입력하세요'));

    expect(within(eventList).getByText('팀 회의')).toBeInTheDocument();
    expect(within(eventList).getByText('점심 식사')).toBeInTheDocument();
  });
});

describe('일정 충돌', () => {
  it('겹치는 시간에 새 일정을 추가할 때 경고가 표시된다', async () => {});

  it('기존 일정의 시간을 수정하여 충돌이 발생하면 경고가 노출된다', async () => {});
});

it('notificationTime을 10으로 하면 지정 시간 10분 전 알람 텍스트가 노출된다', async () => {});
