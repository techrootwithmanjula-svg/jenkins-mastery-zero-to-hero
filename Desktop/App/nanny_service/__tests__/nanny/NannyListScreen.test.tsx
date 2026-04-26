import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import NannyListScreen from '../../src/screens/Nanny/NannyListScreen';
import nannySlice from '../../src/store/slices/nannySlice';
import { ThemeProvider } from '../../src/theme';

const mockNannies = [
  {
    id: '1',
    name: 'Sarah',
    image: 'https://example.com/sarah.jpg',
    rating: 4.8,
    reviewCount: 24,
    distance: 2.5,
    hourlyRate: 25,
    experience: 5,
    specialties: ['Infant care', 'Training'],
    availability: [],
    isOnline: true,
  },
  {
    id: '2',
    name: 'Maria',
    image: 'https://example.com/maria.jpg',
    rating: 4.6,
    reviewCount: 18,
    distance: 3.2,
    hourlyRate: 22,
    experience: 3,
    specialties: ['After-school care'],
    availability: [],
    isOnline: true,
  },
];

const createMockStore = (nannies = mockNannies) => {
  return configureStore({
    reducer: {
      nanny: nannySlice,
    },
    preloadedState: {
      nanny: {
        nannies,
        isLoading: false,
        error: null,
        selectedNanny: null,
      },
    },
  });
};

const mockNavigation = {
  navigate: jest.fn(),
  push: jest.fn(),
};

const mockRoute = {
  params: {
    date: '2026-04-20',
    startTime: '10:00',
    endTime: '13:00',
  },
};

describe('NannyListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ========== T005: Remove top filter/sort controls ==========
  describe('T005: Filter and sorting controls removal', () => {
    it('should not render filter button in top bar', () => {
      const mockNavigate = jest.fn();
      const { queryByTestId } = render(
        <NannyListScreen
          route={mockRoute}
          navigation={{ ...mockNavigation, navigate: mockNavigate }}
        />,
        {
          wrapper: ({ children }) => (
            <Provider store={createMockStore()}>
              <ThemeProvider>{children}</ThemeProvider>
            </Provider>
          ),
        }
      );

      expect(queryByTestId('nanny-list-filter-button')).not.toBeInTheDocument();
    });

    it('should not render sorting-distance button in top bar', () => {
      const mockNavigate = jest.fn();
      const { queryByTestId } = render(
        <NannyListScreen
          route={mockRoute}
          navigation={{ ...mockNavigate }}
        />,
        {
          wrapper: ({ children }) => (
            <Provider store={createMockStore()}>
              <ThemeProvider>{children}</ThemeProvider>
            </Provider>
          ),
        }
      );

      expect(queryByTestId('nanny-list-sort-button')).not.toBeInTheDocument();
    });

    it('should not render filterBar container element', () => {
      const { queryByTestId } = render(
        <NannyListScreen
          route={mockRoute}
          navigation={mockNavigation}
        />,
        {
          wrapper: ({ children }) => (
            <Provider store={createMockStore()}>
              <ThemeProvider>{children}</ThemeProvider>
            </Provider>
          ),
        }
      );

      expect(queryByTestId('nanny-list-filter-bar')).not.toBeInTheDocument();
    });
  });

  // ========== T006: Card tap opens modal without route navigation ==========
  describe('T006: Modal opens on card tap without route navigation', () => {
    it('should open modal when nanny card is tapped', async () => {
      const { getByTestId } = render(
        <NannyListScreen
          route={mockRoute}
          navigation={mockNavigation}
        />,
        {
          wrapper: ({ children }) => (
            <Provider store={createMockStore()}>
              <ThemeProvider>{children}</ThemeProvider>
            </Provider>
          ),
        }
      );

      const nannyCard = getByTestId('nanny-card-1');
      fireEvent.press(nannyCard);

      // Modal should be visible
      await waitFor(() => {
        expect(getByTestId('nanny-preview-modal')).toBeVisible();
      });
    });

    it('should not navigate to NannyDetail route when card is tapped', async () => {
      const mockNavigate = jest.fn();
      const { getByTestId } = render(
        <NannyListScreen
          route={mockRoute}
          navigation={{ ...mockNavigation, navigate: mockNavigate }}
        />,
        {
          wrapper: ({ children }) => (
            <Provider store={createMockStore()}>
              <ThemeProvider>{children}</ThemeProvider>
            </Provider>
          ),
        }
      );

      const nannyCard = getByTestId('nanny-card-1');
      fireEvent.press(nannyCard);

      await waitFor(() => {
        expect(mockNavigate).not.toHaveBeenCalledWith('NannyDetail', expect.anything());
      });
    });

    it('should display selected nanny profile in modal', async () => {
      const { getByTestId, getByText } = render(
        <NannyListScreen
          route={mockRoute}
          navigation={mockNavigation}
        />,
        {
          wrapper: ({ children }) => (
            <Provider store={createMockStore()}>
              <ThemeProvider>{children}</ThemeProvider>
            </Provider>
          ),
        }
      );

      const nannyCard = getByTestId('nanny-card-1');
      fireEvent.press(nannyCard);

      await waitFor(() => {
        expect(getByText('Sarah')).toBeVisible(); // Selected nanny name
      });
    });
  });

  // ========== T007: Modal close and switching profiles ==========
  describe('T007: Modal close and profile switching', () => {
    it('should close modal when close button is pressed', async () => {
      const { getByTestId, queryByTestId } = render(
        <NannyListScreen
          route={mockRoute}
          navigation={mockNavigation}
        />,
        {
          wrapper: ({ children }) => (
            <Provider store={createMockStore()}>
              <ThemeProvider>{children}</ThemeProvider>
            </Provider>
          ),
        }
      );

      const nannyCard = getByTestId('nanny-card-1');
      fireEvent.press(nannyCard);

      await waitFor(() => {
        expect(getByTestId('nanny-preview-modal')).toBeVisible();
      });

      const closeButton = getByTestId('modal-close-button');
      fireEvent.press(closeButton);

      await waitFor(() => {
        expect(queryByTestId('nanny-preview-modal')).not.toBeVisible();
      });
    });

    it('should stay on list after modal close', async () => {
      const mockNavigate = jest.fn();
      const { getByTestId, queryByTestId } = render(
        <NannyListScreen
          route={mockRoute}
          navigation={{ ...mockNavigation, navigate: mockNavigate }}
        />,
        {
          wrapper: ({ children }) => (
            <Provider store={createMockStore()}>
              <ThemeProvider>{children}</ThemeProvider>
            </Provider>
          ),
        }
      );

      const nannyCard = getByTestId('nanny-card-1');
      fireEvent.press(nannyCard);

      await waitFor(() => {
        expect(getByTestId('nanny-preview-modal')).toBeVisible();
      });

      const closeButton = getByTestId('modal-close-button');
      fireEvent.press(closeButton);

      await waitFor(() => {
        expect(queryByTestId('nanny-preview-modal')).not.toBeVisible();
        // Verify list is still visible
        expect(getByTestId('nanny-card-1')).toBeVisible();
      });
    });

    it('should switch to new nanny profile when another card is tapped from list', async () => {
      const { getByTestId, getByText } = render(
        <NannyListScreen
          route={mockRoute}
          navigation={mockNavigation}
        />,
        {
          wrapper: ({ children }) => (
            <Provider store={createMockStore()}>
              <ThemeProvider>{children}</ThemeProvider>
            </Provider>
          ),
        }
      );

      // Open first nanny
      const nannyCard1 = getByTestId('nanny-card-1');
      fireEvent.press(nannyCard1);

      await waitFor(() => {
        expect(getByText('Sarah')).toBeVisible();
      });

      // Tap second nanny card without closing modal
      const nannyCard2 = getByTestId('nanny-card-2');
      fireEvent.press(nannyCard2);

      // Modal should now show second nanny
      await waitFor(() => {
        expect(getByText('Maria')).toBeVisible();
      });
    });

    it('should update modal content immediately when switching between cards', async () => {
      const { getByTestId, queryByText, getByText } = render(
        <NannyListScreen
          route={mockRoute}
          navigation={mockNavigation}
        />,
        {
          wrapper: ({ children }) => (
            <Provider store={createMockStore()}>
              <ThemeProvider>{children}</ThemeProvider>
            </Provider>
          ),
        }
      );

      // Open first nanny
      const nannyCard1 = getByTestId('nanny-card-1');
      fireEvent.press(nannyCard1);

      await waitFor(() => {
        expect(getByText('Sarah')).toBeVisible();
      });

      // Switch to second nanny
      const nannyCard2 = getByTestId('nanny-card-2');
      fireEvent.press(nannyCard2);

      await waitFor(() => {
        expect(queryByText('Sarah')).not.toBeInTheDocument();
        expect(getByText('Maria')).toBeVisible();
      });
    });
  });

  // ========== T013: Booking handoff from modal ==========
  describe('T013: Booking handoff from modal', () => {
    it('should allow booking action from modal context', async () => {
      const { getByTestId } = render(
        <NannyListScreen
          route={mockRoute}
          navigation={mockNavigation}
        />,
        {
          wrapper: ({ children }) => (
            <Provider store={createMockStore()}>
              <ThemeProvider>{children}</ThemeProvider>
            </Provider>
          ),
        }
      );

      const nannyCard = getByTestId('nanny-card-1');
      fireEvent.press(nannyCard);

      await waitFor(() => {
        // Verify book button is visible in modal
        expect(getByTestId('modal-book-button')).toBeVisible();
      });
    });
  });

  // ========== General Nanny List Tests ==========
  describe('General NannyListScreen functionality', () => {
    it('should render list of nannies', async () => {
      const { getByTestId } = render(
        <NannyListScreen
          route={mockRoute}
          navigation={mockNavigation}
        />,
        {
          wrapper: ({ children }) => (
            <Provider store={createMockStore()}>
              <ThemeProvider>{children}</ThemeProvider>
            </Provider>
          ),
        }
      );

      await waitFor(() => {
        expect(getByTestId('nanny-card-1')).toBeVisible();
        expect(getByTestId('nanny-card-2')).toBeVisible();
      });
    });

    it('should display result count', async () => {
      const { getByTestId } = render(
        <NannyListScreen
          route={mockRoute}
          navigation={mockNavigation}
        />,
        {
          wrapper: ({ children }) => (
            <Provider store={createMockStore()}>
              <ThemeProvider>{children}</ThemeProvider>
            </Provider>
          ),
        }
      );

      await waitFor(() => {
        expect(getByTestId('result-count')).toHaveTextContent('2 nannies available');
      });
    });

    it('should show loading spinner when loading', () => {
      const loadingStore = configureStore({
        reducer: {
          nanny: nannySlice,
        },
        preloadedState: {
          nanny: {
            nannies: [],
            isLoading: true,
            error: null,
            selectedNanny: null,
          },
        },
      });

      const { getByText } = render(
        <NannyListScreen
          route={mockRoute}
          navigation={mockNavigation}
        />,
        {
          wrapper: ({ children }) => (
            <Provider store={loadingStore}>
              <ThemeProvider>{children}</ThemeProvider>
            </Provider>
          ),
        }
      );

      expect(getByText('Finding nannies...')).toBeVisible();
    });

    it('should show error message when error occurs', () => {
      const errorStore = configureStore({
        reducer: {
          nanny: nannySlice,
        },
        preloadedState: {
          nanny: {
            nannies: [],
            isLoading: false,
            error: 'Failed to fetch nannies',
            selectedNanny: null,
          },
        },
      });

      const { getByText } = render(
        <NannyListScreen
          route={mockRoute}
          navigation={mockNavigation}
        />,
        {
          wrapper: ({ children }) => (
            <Provider store={errorStore}>
              <ThemeProvider>{children}</ThemeProvider>
            </Provider>
          ),
        }
      );

      expect(getByText('Failed to fetch nannies')).toBeVisible();
    });
  });
});
