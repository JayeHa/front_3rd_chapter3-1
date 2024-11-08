import { Alert, AlertIcon, AlertTitle, Box, CloseButton, Flex, VStack } from '@chakra-ui/react';
import { useState } from 'react';

import { Calendar } from './components/Calendar.tsx';
import { DialogEventOverlapAlert } from './components/DialogEventOverlapAlert.tsx';
import { EventInputForm } from './components/EventInputForm.tsx';
import { EventSearchForm } from './components/EventSearchForm.tsx';
import { useCalendarView } from './hooks/useCalendarView.ts';
import { useEventOperations } from './hooks/useEventOperations.ts';
import { useNotifications } from './hooks/useNotifications.ts';
import { useSearch } from './hooks/useSearch.ts';
import { useEventFormStore } from './store/useEventFormStore.ts';
import { Event } from './types';

function App() {
  const { editingEvent, setEditingEvent, editEvent } = useEventFormStore();

  const { events, saveEvent, deleteEvent } = useEventOperations(Boolean(editingEvent), () =>
    setEditingEvent(null)
  );

  const { notifications, notifiedEvents, setNotifications } = useNotifications(events);
  const { view, setView, currentDate, holidays, navigate } = useCalendarView();
  const { searchTerm, filteredEvents, setSearchTerm } = useSearch(events, currentDate, view);

  const [isOverlapDialogOpen, setIsOverlapDialogOpen] = useState(false);
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);

  return (
    <Box w="full" h="100vh" m="auto" p={5}>
      <Flex gap={6} h="full">
        <EventInputForm
          events={events}
          saveEvent={saveEvent}
          setIsOverlapDialogOpen={setIsOverlapDialogOpen}
          setOverlappingEvents={setOverlappingEvents}
        />

        <Calendar
          currentDate={currentDate}
          filteredEvents={filteredEvents}
          holidays={holidays}
          navigate={navigate}
          notifiedEvents={notifiedEvents}
          setView={setView}
          view={view}
        />

        <EventSearchForm
          deleteEvent={deleteEvent}
          editEvent={editEvent}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </Flex>

      <DialogEventOverlapAlert
        isOverlapDialogOpen={isOverlapDialogOpen}
        overlappingEvents={overlappingEvents}
        setIsOverlapDialogOpen={setIsOverlapDialogOpen}
        saveEvent={saveEvent}
      />

      {notifications.length > 0 && (
        <VStack position="fixed" top={4} right={4} spacing={2} align="flex-end">
          {notifications.map((notification, index) => (
            <Alert key={index} status="info" variant="solid" width="auto">
              <AlertIcon />
              <Box flex="1">
                <AlertTitle fontSize="sm">{notification.message}</AlertTitle>
              </Box>
              <CloseButton
                onClick={() => setNotifications((prev) => prev.filter((_, i) => i !== index))}
              />
            </Alert>
          ))}
        </VStack>
      )}
    </Box>
  );
}

export default App;
