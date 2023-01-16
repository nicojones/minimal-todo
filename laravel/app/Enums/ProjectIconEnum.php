<?php

namespace App\Enums;

enum ProjectIconEnum: string
{
  case CIRCLE = "circle";
  case GRADE = "grade";
  case FAVORITE = "favorite";
  case HOME = "home";
  case PUBLIC = "public";
  case ROCKET = "rocket";
  case MOOD = "mood";
  case NAVIGATION = "navigation";
  case EXTENSION = "extension";
  case SUNNY = "sunny";
  case LIGHTBULB = "lightbulb";
  case COMMENT = "comment";
  case LANDSCAPE = "landscape";
  // case BUILDING = "building";
  case PHOTO = "photo";
  // case CALENDAR_TODAY = "calendar today";


  public static function strings(): array
  {
    $strings = [];
    foreach (self::cases() as $case) {
      $strings[] = $case->value;
    }
    return $strings;
  }
}
