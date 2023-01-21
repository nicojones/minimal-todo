@inject('functions', '\App\Functions\Functions')
@extends('layouts.email')

@section('content')

<h2>Hello {{ $user->name }}!</h2>
<h2 style="font-family: 'Maven Pro', 'Roboto', sans-serif;">You set an alert for
  @if ($taskCount > 1)
  <i>{{ $projects[0]['taskData'][0]['name'] }}</i> and {{ $taskCount - 1 }} other tasks.
  @else
  <i>{{ $projects[0]['taskData'][0]['name'] }}</i>.
  @endif
</h2>

@foreach ($projects as $project)
<h3>
  Project: <span style="display:inline-block; width: 12px; height: 12px; border-radius: 100%; background-color: {{$project['project']['color']}}"></span>
  <a href="{{env('APP_URL')}}/app/{{$project['project']['id']}}" target="_blank">{{ $project['project']['name'] }}</a>
</h3>
<small style="color: #aaa">
  @if($project['hasOtherUsers'])
  @foreach($project['users'] as $_user)
  @if(!$loop->first && !$loop->last),@endif
  @if(!$loop->first && $loop->last) and @endif
  <b>{{ $_user['name'] }}</b>
  @endforeach

  @if(count($project['users']) == 1)
  is also a member and has been notified.
  @else
  are also members and have been notified.
  @endif
  @endif
</small>
<ul style="list-style-type: none">
  @foreach ($project['taskData'] as $taskData)
  @include('components.task', [
    'name' => $taskData['name'],
    'deadline' => $taskData['deadline'],
    'priority' => $taskData['priority']
  ])
  @endforeach
</ul>
@endforeach

<p>
  You are receiving this email because you have alerts for several of your todo tasks <br />
  You can disable this notification by setting "alerts = none" on each of the tasks.
</p>
@stop
