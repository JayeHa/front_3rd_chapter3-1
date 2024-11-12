import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Mock } from 'vitest';

import { NotificationList } from '../../components/NotificationList';
import { Notification } from '../../types';

describe('NotificationList', () => {
  let removeNotification: Mock;

  beforeEach(() => {
    removeNotification = vi.fn();
  });

  const setup = (notifications: Notification[]) => {
    const user = userEvent.setup();

    return {
      ...render(
        <ChakraProvider>
          <NotificationList notifications={notifications} removeNotification={removeNotification} />
        </ChakraProvider>
      ),
      user,
    };
  };

  it('알림이 제공될 때 렌더링된다', () => {
    setup([
      { id: '1', message: '알림 1' },
      { id: '2', message: '알림 2' },
    ]);

    expect(screen.getByText('알림 1')).toBeInTheDocument();
    expect(screen.getByText('알림 2')).toBeInTheDocument();
  });

  it('알림이 없을 때 렌더링되지 않는다', () => {
    setup([]);

    const notificationElements = screen.queryByText(/알림/i);
    expect(notificationElements).not.toBeInTheDocument();
  });

  it('닫기 버튼 클릭 시 removeNotification가 호출된다', async () => {
    const { user, getByTestId } = setup([{ id: '1', message: '알림 1' }]);

    await user.click(getByTestId('close-button'));

    expect(removeNotification).toHaveBeenCalledTimes(1);
  });

  it('닫기 버튼 클릭 시 올바른 알림이 제거된다', async () => {
    const targetIndex = 0;
    const notifications = [
      { id: '1', message: '알림 1' },
      { id: '2', message: '알림 2' },
    ];
    const { user, getAllByTestId } = setup(notifications);

    const closeButtons = getAllByTestId('close-button');
    await user.click(closeButtons[targetIndex]); // 첫 번째 알림의 닫기 버튼 클릭

    expect(removeNotification).toHaveBeenCalledWith(targetIndex);
  });
});
