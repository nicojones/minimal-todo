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
        // $fromHoursInAdvance = 23;
        $toHoursInAdvance = 24;

        $tasksWithDeadline = Task::whereNotNull('deadline')
            ->where('alert', true)
            ->where('deadline', '<', Functions::getFutureTime($toHoursInAdvance * 60 * 60))
            ->where('deadline', '>', Functions::getFutureTime($fromHoursInAdvance * 60 * 60))
            ->get();

        $this->info("length? " . count($tasksWithDeadline));

        foreach ($tasksWithDeadline as $task) {
            $this->info('TASK: ' . $task->project->users);
            foreach ($task->project->users as $user) {
                $this->info('TASK: ' . $task->name . " for user " . $user->email);

                
                $data = [
                    'task_message' => 'hello!'
                    // 'Task name: ' . $task->name . ' has a deadline on ' . $task->deadline
                ];
                // $this->info(view('emails.task_deadline', $data));
                Mail::to($user->email)->send(new TaskNotificationMail($user->email, $data));
            }
        }

        return Command::SUCCESS;
    }
}
