import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:namer_app/assets/themes/theme_setup.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'main.dart';

class SettingsPage extends StatelessWidget {
  final List<String> themeNames = themes.keys.toList();

  @override
  Widget build(BuildContext context) {
    // Standardized button dimensions
    double buttonWidth = MediaQuery.of(context).size.width * 0.8;
    double buttonHeight = 50.0;

    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      appBar: AppBar(
        title: Text('Settings'),
      ),
      body: Center(
        // Center the entire column
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            buildButton(
              context,
              'Themes',
              buttonWidth,
              buttonHeight,
              () => _showThemesDialog(context),
              textColor: Theme.of(context).colorScheme.onSecondary,
              backgroundColor: Theme.of(context).colorScheme.primary,
            ),
            SizedBox(height: 20),
            buildButton(
              context,
              'Edit Profile Picture',
              buttonWidth,
              buttonHeight,
              () => _showThemesDialog(context),
              textColor: Theme.of(context).colorScheme.onSecondary,
              backgroundColor: Theme.of(context).colorScheme.primary,
            ),
            SizedBox(height: 20),
            SizedBox(
              width: buttonWidth,
              height: buttonHeight,
              child: ElevatedButton(
                onPressed: () => _logout(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30),
                  ),
                ),
                child: Text('LOGOUT'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget buildButton(BuildContext context, String text, double width,
      double height, VoidCallback onPressed,
      {Color? textColor, Color? backgroundColor}) {
    return SizedBox(
      width: width,
      height: height,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          primary: backgroundColor ??
              Theme.of(context).colorScheme.primary, // Background color
          onPrimary: textColor ??
              Theme.of(context).colorScheme.onSecondary, // Text color
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(30),
          ),
        ),
        child: Text(text),
      ),
    );
  }

  void _showThemesDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return Dialog(
          backgroundColor: Theme.of(context).colorScheme.secondary,
          insetPadding: EdgeInsets.only(
            top: MediaQuery.of(context).size.height * 0.1,
            bottom: MediaQuery.of(context).size.height * 0.1,
            left: MediaQuery.of(context).size.width * 0.05,
            right: MediaQuery.of(context).size.width * 0.05,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.all(Radius.circular(20.0)),
          ),
          child: SingleChildScrollView(
            scrollDirection: Axis.vertical,
            child: Column(
              children: List.generate(
                themeNames.length, // Use the count of themes here
                (index) => Container(
                  width: 300,
                  height: 100,
                  padding: EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: ElevatedButton(
                    onPressed: () {
                      var themeIdentifier = themeNames[index];
                      var selectedTheme = themes[themeIdentifier];
                      if (selectedTheme != null) {
                        Provider.of<ThemeNotifier>(context, listen: false)
                            .setTheme(selectedTheme);
                        _saveSelectedTheme(themeIdentifier);
                      }
                    },
                    child: Text(themeNames[index]),
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Future<void> _saveSelectedTheme(String themeIdentifier) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('selectedTheme', themeIdentifier);
  }

  void _showEditProfileDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        // Implement the edit profile picture functionality
        return Dialog();
      },
    );
  }

  void _logout(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('userEmail');

    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (context) => MyApp()),
      (Route<dynamic> route) => false,
    );
  }
}
