<?php

namespace App\Functions;

class Functions
{


  public static function getTime(int $timeInMilliseconds)
  {
    return date('Y-m-d H:i:s', $timeInMilliseconds / 1000);
    // return date('Y-m-d\TH:i:s.000000\Z', time() + $futureSeconds);
  }

  public static function getFutureTime(int $futureSeconds = 0)
  {
    return date('Y-m-d H:i:s', time() + $futureSeconds);
    // return date('Y-m-d\TH:i:s.000000\Z', time() + $futureSeconds);
  }

  public static function randomHex()
  {
    return sprintf('#%06X', mt_rand(0, 0xFFFFFF));
  }

  public static function priorityColor(int $priorityLevel)

  {
    switch ($priorityLevel) {
      case 1:
        return "#f1c40f";
        case 2:
          return "#3498db";
      case 3:
        return "#e74c3c";
      default:
        return "#aaaaaa";
    }
  }
}
