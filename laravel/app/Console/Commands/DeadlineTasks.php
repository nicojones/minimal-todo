<?php

namespace App\Console\Commands;

use App\Functions\Functions;
use App\Mail\TaskNotificationMail;
use App\Models\Task;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

use function App\Functions\getFutureTime;

class DeadlineTasks extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email:deadline-tasks';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Notify users that a task is reaching the deadline';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $fromHoursInAdvance = 0;
        $toHoursInAdvance = 1;

        $tasksWithDeadline = Task::whereNotNull('alert')
            ->where('alert', '>', Functions::getFutureTime($fromHoursInAdvance * 60 * 60))
            ->where('alert', '<', Functions::getFutureTime($toHoursInAdvance * 60 * 60))
            ->with('project', 'project.users')
            ->get();


        $taskDataByUser = [];
        foreach ($tasksWithDeadline as $task) {
            $taskUsers = $task->project->users;
            foreach ($taskUsers as $user) {
                // Manually set the userID we need to retrieve Pivot Table data from.
                $task->project->pivotTableUserId = $user->id;

                if (empty($taskDataByUser[$user->id])) {
                    $taskDataByUser[$user->id] = [
                        'user' => $user,
                        'taskCount' => 0,
                        'projects' => []
                    ];
                }
                if (empty($taskDataByUser[$user->id]['projects'][$task->project->id])) {
                    $taskDataByUser[$user->id]['projects'][$task->project->id] = [
                        'project' => $task->project,
                        'hasOtherUsers' => count($task->project->users) > 1,
                        'task' => [],
                        'users' => array_filter(
                            $task->project->users->toArray(),
                            function ($_user) use ($user) {
                                return $user->id !== $_user['id'];
                            }
                        )
                    ];
                }

                ++$taskDataByUser[$user->id]['taskCount'];

                $taskDataByUser[$user->id]['projects'][$task->project->id]['taskData'][] = $task;
            }
        }

        if (!count($taskDataByUser)) {
            $this->info("No tasks on deadline");
        }
        foreach ($taskDataByUser as $taskDataForUser) {
            $user = $taskDataForUser['user'];
            $this->info("sending email to " . $user->email . " with " . $taskDataForUser['taskCount'] . " tasks.");

            Mail::to($user->email)->send(new TaskNotificationMail([
                'user' => $taskDataForUser['user'],
                'taskCount' => $taskDataForUser['taskCount'],
                'projects' => array_values($taskDataForUser['projects']),
            ]));
            break;
        }

        return Command::SUCCESS;
    }
}
