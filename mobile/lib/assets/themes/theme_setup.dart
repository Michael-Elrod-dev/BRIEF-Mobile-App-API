import 'package:flutter/material.dart';

Map<String, ThemeData> themes = {
  'Default': ThemeData(
    colorScheme: ColorScheme.fromSwatch().copyWith(
      primary: Color.fromARGB(255, 0, 113, 194),
      secondary: Color.fromARGB(255, 131, 183, 219),
      onSecondary: Colors.white, // For text color
      background: Colors.white,
    ),
    unselectedWidgetColor: Color.fromARGB(255, 106, 171, 218),
  ),
  'Dark': ThemeData(
    colorScheme: ColorScheme.fromSwatch().copyWith(
      primary: const Color.fromARGB(255, 58, 58, 58),
      secondary: Color.fromARGB(255, 145, 145, 145),
      onSecondary: Colors.white, // For text color
      background: Colors.black,
    ),
    unselectedWidgetColor: Color.fromARGB(255, 106, 171, 218),
  ),
  'Ocean': ThemeData(
    colorScheme: ColorScheme.fromSwatch().copyWith(
      primary: Color(0xFF005A9C), // Deep Ocean Blue
      secondary: Color(0xFF3B9C9C), // Seafoam Green
      onSecondary: Colors.white, // For text color
      background: Colors.white,
    ),
    unselectedWidgetColor: Color(0xFF3B9C9C),
  ),
  'Fire': ThemeData(
    colorScheme: ColorScheme.fromSwatch().copyWith(
      primary: Color(0xFFD32F2F), // Fiery Red
      secondary: Color(0xFFF57C00), // Burnt Orange
      onSecondary: Colors.white, // For text color
      background: Colors.black,
    ),
    unselectedWidgetColor: Color(0xFFF57C00),
  ),
  'Earth': ThemeData(
    colorScheme: ColorScheme.fromSwatch().copyWith(
      primary: Color(0xFF388E3C), // Forest Green
      secondary: Color(0xFF795548), // Earthy Brown
      onSecondary: Colors.black, // For text color
      background: Colors.white,
    ),
    unselectedWidgetColor: Color(0xFF795548),
  ),
  'Sunset': ThemeData(
    colorScheme: ColorScheme.fromSwatch().copyWith(
      primary: Color(0xFF6A1B9A), // Sunset Purple
      secondary: Color(0xFFAD1457), // Twilight Magenta
      onSecondary: Colors.black, // For text color
      background: Colors.white,
    ),
    unselectedWidgetColor: Color(0xFFAD1457),
  ),
  'Sky': ThemeData(
    colorScheme: ColorScheme.fromSwatch().copyWith(
      primary: Color(0xFF2196F3), // Sky Blue
      secondary: Color(0xFFECEFF1), // Cloud White
      onSecondary: Colors.white, // For text color
      background: Color.fromARGB(255, 127, 192, 245),
    ),
    unselectedWidgetColor: Color(0xFFECEFF1),
  ),
  'Mountain': ThemeData(
    colorScheme: ColorScheme.fromSwatch().copyWith(
      primary: Color(0xFF455A64), // Mountain Gray
      secondary: Color(0xFFCFD8DC), // Snowy White
      onSecondary: Colors.black, // For text color
      background: Colors.white,
    ),
    unselectedWidgetColor: Color(0xFFCFD8DC),
  ),
  'Desert': ThemeData(
    colorScheme: ColorScheme.fromSwatch().copyWith(
      primary: Color(0xFFFFCC80), // Sandy Beige
      secondary: Color(0xFF4CAF50), // Cactus Green
      onSecondary: Colors.white, // For text color
      background: Colors.black,
    ),
    unselectedWidgetColor: Color(0xFF4CAF50),
  ),
  'Forest': ThemeData(
    colorScheme: ColorScheme.fromSwatch().copyWith(
      primary: Color(0xFF2E7D32), // Pine Green
      secondary: Color.fromARGB(255, 170, 131, 117), // Mushroom Brown
      onSecondary: Colors.black, // For text color
      background: Colors.white,
    ),
    unselectedWidgetColor: Color(0xFFA1887F),
  ),
  'Glacier': ThemeData(
    colorScheme: ColorScheme.fromSwatch().copyWith(
      primary: Color(0xFF80DEEA), // Glacier Blue
      secondary: Color(0xFFE0F7FA), // Polar White
      onSecondary: Colors.white, // For text color
      background: Colors.black,
    ),
    unselectedWidgetColor: Color(0xFFE0F7FA),
  ),
  'Volcanic': ThemeData(
    colorScheme: ColorScheme.fromSwatch().copyWith(
      primary: Color(0xFFD84315), // Lava Red
      secondary: Color(0xFF757575), // Ash Gray
      onSecondary: Colors.black, // For text color
      background: Colors.white,
    ),
    unselectedWidgetColor: Color(0xFF757575),
  ),
};
