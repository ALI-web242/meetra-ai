import JoinAsGuest from '@/components/meeting/JoinAsGuest';

interface JoinPageProps {
  params: Promise<{
    meetingId: string;
  }>;
  searchParams: Promise<{
    code?: string;
  }>;
}

export default async function JoinPage({ params, searchParams }: JoinPageProps) {
  const { meetingId } = await params;
  const { code } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <JoinAsGuest meetingId={meetingId} inviteCode={code} />
      </div>
    </main>
  );
}
