import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import JoinAsGuest from '../../../src/components/meeting/JoinAsGuest';

// Mock fetch API
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('JoinAsGuest', () => {
  const mockMeetingId = '550e8400-e29b-41d4-a716-446655440000';
  const mockInviteCode = 'MEETRA-CODE';

  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('renders join as guest form', () => {
    render(<JoinAsGuest meetingId={mockMeetingId} />);

    expect(screen.getByRole('heading', { name: /join meeting/i })).toBeInTheDocument();
    expect(screen.getByText(/joining as a guest/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /join as guest/i })).toBeInTheDocument();
  });

  it('displays meeting ID', () => {
    render(<JoinAsGuest meetingId={mockMeetingId} />);

    expect(screen.getByText(mockMeetingId)).toBeInTheDocument();
  });

  it('submits join request on button click', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        guestSessionId: 'session-uuid',
        accessToken: 'guest-token',
        expiresAt: new Date().toISOString(),
      }),
    });

    render(<JoinAsGuest meetingId={mockMeetingId} inviteCode={mockInviteCode} />);
    const user = userEvent.setup();

    const joinButton = screen.getByRole('button', { name: /join as guest/i });
    await user.click(joinButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/guest/join'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            meetingId: mockMeetingId,
            inviteCode: mockInviteCode,
          }),
        }),
      );
    });
  });

  it('shows success message after joining', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        guestSessionId: 'session-uuid',
        accessToken: 'guest-token',
        expiresAt: new Date().toISOString(),
      }),
    });

    render(<JoinAsGuest meetingId={mockMeetingId} />);
    const user = userEvent.setup();

    const joinButton = screen.getByRole('button', { name: /join as guest/i });
    await user.click(joinButton);

    await waitFor(() => {
      expect(screen.getByText(/successfully joined/i)).toBeInTheDocument();
    });
  });

  it('shows error message on join failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        message: 'Meeting not found',
      }),
    });

    render(<JoinAsGuest meetingId={mockMeetingId} />);
    const user = userEvent.setup();

    const joinButton = screen.getByRole('button', { name: /join as guest/i });
    await user.click(joinButton);

    await waitFor(() => {
      expect(screen.getByText(/meeting not found/i)).toBeInTheDocument();
    });
  });

  it('disables button while loading', async () => {
    mockFetch.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000)),
    );

    render(<JoinAsGuest meetingId={mockMeetingId} />);
    const user = userEvent.setup();

    const joinButton = screen.getByRole('button', { name: /join as guest/i });
    await user.click(joinButton);

    await waitFor(() => {
      expect(joinButton).toBeDisabled();
    });
  });

  it('has links to register and login', () => {
    render(<JoinAsGuest meetingId={mockMeetingId} />);

    expect(screen.getByRole('link', { name: /create an account/i })).toHaveAttribute(
      'href',
      '/register',
    );
    expect(screen.getByRole('link', { name: /login/i })).toHaveAttribute(
      'href',
      '/login',
    );
  });
});
