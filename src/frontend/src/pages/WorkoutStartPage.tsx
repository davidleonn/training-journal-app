import { useNavigate } from 'react-router-dom';
import { Plus, ChevronRight, Play, Calendar, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const WorkoutStartPage = () => {
  const navigate = useNavigate();

  // 💡 MOCK DATA
  const activeProgram = {
    id: 'prog-1',
    name: 'Classic PPL Split',
    description: '6 days/week • Hypertrophy focus',
    progress: 'Week 4 of 12',
    workouts: [
      {
        id: 'w1',
        name: 'Push (Chest/Tri/Shoulders)',
        lastPerformed: 'Today',
        duration: '60 min',
        doneThisWeek: true,
        recommended: false,
      },
      {
        id: 'w2',
        name: 'Pull (Back/Biceps)',
        lastPerformed: '4 days ago',
        duration: '55 min',
        doneThisWeek: false,
        recommended: true,
      },
      {
        id: 'w3',
        name: 'Legs (Quads/Hamstrings)',
        lastPerformed: '1 week ago',
        duration: '70 min',
        doneThisWeek: false,
        recommended: false,
      },
    ],
  };

  const handleStartWorkout = (workoutName: string) => {
    navigate('/workouts/new');
  };

  return (
    // 1. Container matches HistoryPage (max-w-7xl)
    <div className="min-h-screen bg-gray-50 pb-20" data-testid="workout-start-page">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* 2. Header Row: Title on Left, Back Button on Right */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Start Session</h1>

          <Button
            variant="outline"
            className="border-transparent bg-transparent text-gray-500 shadow-none hover:bg-white hover:text-orange-600 hover:shadow-sm"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* 3. Grid Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* LEFT COLUMN: Active Program (2/3 width) */}
          <div className="space-y-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold tracking-wider text-gray-400 uppercase">Current Routine</h2>
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-orange-200 text-xs text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                onClick={() => navigate('/routines')}
              >
                Change Routine
              </Button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
              <div className="bg-linear-to-br from-orange-600 to-orange-800 p-6 text-white">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded bg-white/20 px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase backdrop-blur-sm">Active</span>
                  <span className="text-xs text-orange-100">{activeProgram.progress}</span>
                </div>
                <h3 className="text-xl font-bold">{activeProgram.name}</h3>
                <p className="text-sm text-orange-100/80">{activeProgram.description}</p>
              </div>

              <div className="divide-y divide-gray-100">
                {activeProgram.workouts.map((workout) => (
                  <div
                    key={workout.id}
                    onClick={() => handleStartWorkout(workout.name)}
                    className={`group flex cursor-pointer items-center justify-between p-4 transition-colors ${workout.doneThisWeek ? 'bg-gray-50 opacity-60 hover:opacity-100' : 'hover:bg-orange-50/50'} ${workout.recommended ? 'bg-orange-50/40' : ''} `}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          workout.doneThisWeek
                            ? 'bg-green-100 text-green-600'
                            : workout.recommended
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {workout.doneThisWeek ? (
                          <CheckCircle2 size={20} />
                        ) : workout.recommended ? (
                          <Play size={20} fill="currentColor" />
                        ) : (
                          <Calendar size={20} />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <p className={`font-bold ${workout.doneThisWeek ? 'text-gray-500 line-through decoration-gray-300' : 'text-gray-900'}`}>
                            {workout.name}
                          </p>
                          {workout.recommended && !workout.doneThisWeek && (
                            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-800">NEXT UP</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {workout.doneThisWeek ? 'Completed this week' : `${workout.duration} • Last: ${workout.lastPerformed}`}
                        </p>
                      </div>
                    </div>

                    {!workout.doneThisWeek && (
                      <ChevronRight className="text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-orange-600" size={20} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Quick Start (1/3 width) */}
          <div className="space-y-6 lg:col-span-1">
            <h2 className="text-sm font-bold tracking-wider text-gray-400 uppercase">Other Options</h2>

            <button
              onClick={() => navigate('/workouts/new')}
              className="flex w-full items-center gap-4 rounded-xl border border-dashed border-gray-300 bg-transparent p-5 text-left transition-all hover:border-orange-500 hover:bg-white hover:shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500 group-hover:text-orange-500">
                <Plus size={24} strokeWidth={3} />
              </div>
              <div>
                <p className="font-bold text-gray-700 group-hover:text-orange-600">Empty Workout</p>
                <p className="text-xs text-gray-500">Log freestyle without a template</p>
              </div>
            </button>

            <div className="rounded-xl bg-blue-50 p-5 text-sm text-blue-700">
              <p className="mb-1 font-bold">💡 Tip</p>
              Don't see your routine? Create a new program in the "Change Routine" menu to track your specific split.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
