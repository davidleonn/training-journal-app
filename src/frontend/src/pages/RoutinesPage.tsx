import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Layers, Calendar, Play, Plus, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const RoutinesPage = () => {
  const navigate = useNavigate();

  // Mock Data
  const programs = [
    {
      id: 'prog-1',
      name: 'Classic PPL Split',
      description: 'The gold standard for hypertrophy. 6 days a week.',
      difficulty: 'Intermediate',
      workouts: [
        { name: 'Push (Chest/Triceps/Shoulders)', duration: '60 min' },
        { name: 'Pull (Back/Biceps)', duration: '55 min' },
        { name: 'Legs (Quads/Hams)', duration: '70 min' },
      ],
      active: true,
    },
    {
      id: 'prog-2',
      name: 'Arnold Split',
      description: 'High volume, antagonistic pairing.',
      difficulty: 'Advanced',
      workouts: [
        { name: 'Chest & Back', duration: '90 min' },
        { name: 'Shoulders & Arms', duration: '75 min' },
        { name: 'Legs & Lower Back', duration: '80 min' },
      ],
      active: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20" data-testid="routines-page">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header: Consistent Title Left, Back Button Right */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Routines</h1>

          <Button
            variant="outline"
            className="border-transparent bg-transparent text-gray-500 shadow-none hover:bg-white hover:text-orange-600 hover:shadow-sm"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* 1. SECTION: Existing Programs */}
        <div className="mb-12 space-y-6">
          <h2 className="text-sm font-bold tracking-wider text-gray-400 uppercase">Your Saved Splits</h2>

          <div className="grid grid-cols-1 gap-6">
            {programs.map((program) => (
              <div
                key={program.id}
                className={`group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md ${
                  program.active ? 'border-orange-200 ring-1 ring-orange-100' : 'border-gray-200'
                }`}
              >
                {program.active && (
                  <div className="absolute top-0 right-0 rounded-bl-xl bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">ACTIVE</div>
                )}

                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  {/* Left: Info */}
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <div className={`rounded-lg p-2 ${program.active ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
                        <Layers size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{program.name}</h3>
                    </div>
                    <p className="mb-4 text-sm text-gray-500">{program.description}</p>
                    <div className="flex items-center gap-4 text-xs font-medium tracking-wide text-gray-400 uppercase">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> {program.workouts.length} Workouts
                      </span>
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-600">{program.difficulty}</span>
                    </div>
                  </div>

                  {/* Middle: Workout List Preview */}
                  <div className="flex-1 border-t border-gray-100 pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-6">
                    <h4 className="mb-3 text-left text-xs font-bold text-gray-400 uppercase">Rotation</h4>
                    <ul className="space-y-2">
                      {program.workouts.map((workout, idx) => (
                        <li key={idx} className="flex items-center justify-between rounded-lg p-2 text-sm text-gray-600 hover:bg-gray-50">
                          <span>
                            {idx + 1}. {workout.name}
                          </span>
                          <span className="text-xs text-gray-400">{workout.duration}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex justify-end gap-3 pt-4 md:flex-col md:pt-0">
                    <Button variant="outline" className="flex-1 md:flex-none">
                      Edit
                    </Button>
                    <Button className="flex-1 shadow-lg shadow-orange-200 md:flex-none">
                      <Play size={16} className="mr-2" fill="currentColor" /> Start Next
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. SECTION: Create New (Consistent with Start Page "Other Options") */}
        <div className="border-t border-gray-200 pt-8">
          <h2 className="mb-4 text-sm font-bold tracking-wider text-gray-400 uppercase">New Program</h2>
          <button
            onClick={() => console.log('Create New Program Flow')}
            className="group flex w-full items-center justify-between rounded-xl border border-dashed border-gray-300 bg-transparent p-6 text-left transition-all hover:border-orange-500 hover:bg-white hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500 group-hover:bg-orange-100 group-hover:text-orange-600">
                <Plus size={24} strokeWidth={3} />
              </div>
              <div>
                <p className="font-bold text-gray-700 group-hover:text-orange-900">Build a New Split</p>
                <p className="text-sm text-gray-500">Design a custom rotation of workouts</p>
              </div>
            </div>
            <ChevronRight className="text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-orange-500" size={24} />
          </button>
        </div>
      </main>
    </div>
  );
};
