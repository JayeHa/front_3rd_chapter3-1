import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Mock } from 'vitest';

import { NotificationList } from '../../components/NotificationList';
import { Notification } from '../../types';

describe('NotificationList', () => {
  let setNotifications: Mock;

  beforeEach(() => {
    setNotifications = vi.fn();
  });

  const setup = (notifications: Notification[]) => {
    const user = userEvent.setup();

    return {
      ...render(
        <ChakraProvider>
          <NotificationList notifications={notifications} setNotifications={setNotifications} />
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

  it('닫기 버튼 클릭 시 setNotifications가 호출된다', async () => {
    const { user, getByTestId } = setup([{ id: '1', message: '알림 1' }]);

    await user.click(getByTestId('close-button'));

    expect(setNotifications).toHaveBeenCalledTimes(1);
  });

  it('닫기 버튼 클릭 시 올바른 알림이 제거된다', async () => {
    const notifications = [
      { id: '1', message: '알림 1' },
      { id: '2', message: '알림 2' },
    ];
    const { user, getAllByTestId } = setup(notifications);

    const closeButtons = getAllByTestId('close-button');
    await user.click(closeButtons[0]); // 첫 번째 알림의 닫기 버튼 클릭

    expect(setNotifications).toHaveBeenCalled();
    expect(setNotifications.mock.calls[0][0](notifications)).toEqual([
      { id: '2', message: '알림 2' },
    ]);
  });
});
