<?php

namespace App\Enums;

use BackedEnum;

enum ProjectSortEnum: string
{
  case A_TO_Z = "A_TO_Z";
  case Z_TO_A = "Z_TO_A";
  case PRIORITY = "PRIORITY";
  case OLDEST_FIRST = "OLDEST_FIRST";
  case NEWEST_FIRST = "NEWEST_FIRST";


  public static function strings(): array
  {
    $strings = [];
    foreach (self::cases() as $case) {
      $strings[] = $case->value;
    }
    return $strings;
  }

}
