import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Mock, vi } from 'vitest';

import { DialogEventOverlapAlert } from '../../components/DialogEventOverlapAlert';
import { useEventFormStore } from '../../store/useEventFormStore';
import { useEventOverlapStore } from '../../store/useEventOverlapStore';
import { generateTestEvent, generateTestEvents } from '../utils';

const 새로운일정 = generateTestEvent({
  id: '3',
  title: '새로운 일정',
  date: '2024-11-1',
});

describe('DialogEventOverlapAlert', () => {
  let saveEvent: Mock;
  let closeDialog: Mock;

  beforeEach(() => {
    saveEvent = vi.fn();
    closeDialog = vi.fn();

    useEventOverlapStore.setState({
      isOverlapDialogOpen: true,
      overlappingEvents: generateTestEvents([
        { id: '1', date: '2024-11-1', title: '겹치는 일정 1' },
        { id: '2', date: '2024-11-1', title: '겹치는 일정 2' },
      ]),
      closeDialog,
    });

    useEventFormStore.setState({
      eventForm: { ...새로운일정, isRepeating: false },
      editingEvent: 새로운일정,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const setup = () => {
    return render(
      <ChakraProvider>
        <DialogEventOverlapAlert saveEvent={saveEvent} />
      </ChakraProvider>
    );
  };

  it('다이얼로그가 열리고 겹치는 이벤트가 표시된다', () => {
    setup();

    expect(screen.getByText(/일정 겹침 경고/)).toBeInTheDocument();
    expect(screen.getByText(/겹치는 일정 1/)).toBeInTheDocument();
    expect(screen.getByText(/겹치는 일정 2/)).toBeInTheDocument();
    expect(screen.getByText(/계속 진행하시겠습니까?/)).toBeInTheDocument();
  });

  it('취소 버튼 클릭 시 다이얼로그가 닫힌다', async () => {
    setup();

    const cancelButton = screen.getByText('취소');
    await userEvent.click(cancelButton);

    expect(closeDialog).toHaveBeenCalled();
  });

  it('계속 진행 버튼 클릭 시 saveEvent가 호출된다', async () => {
    setup();

    const proceedButton = screen.getByText('계속 진행');
    await userEvent.click(proceedButton);

    expect(saveEvent).toHaveBeenCalledTimes(1);
    expect(saveEvent).toHaveBeenCalledWith(새로운일정);
  });
});
