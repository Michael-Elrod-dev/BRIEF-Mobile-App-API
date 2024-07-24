import 'package:confetti/confetti.dart';
import 'package:flutter/material.dart';
import 'data.dart';
import 'use_api.dart';

class AssignmentHolder extends StatefulWidget {
  final Assignment assignment;

  const AssignmentHolder({Key? key, required this.assignment})
      : super(key: key);

  @override
  _AssignmentHolderState createState() => _AssignmentHolderState();
}

class _AssignmentHolderState extends State<AssignmentHolder> {
  int currentQuestionIndex = 0;
  int? selectedChoiceIndex;
  List<String> selectedChoices = [];
  late ConfettiController _confettiController;
  bool showConfetti = false;
  User? _user;

  @override
  void initState() {
    super.initState();
    _fetchUserData();
    _confettiController = ConfettiController(duration: Duration(seconds: 3));
  }

  @override
  void dispose() {
    _confettiController.dispose();
    super.dispose();
  }

  Future<void> _fetchUserData() async {
    ApiService apiService = ApiService();
    try {
      _user = await apiService.getUser();
    } catch (e) {
      print('Error fetching user data: $e');
    }
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    final currentQuestion = widget.assignment.questions[currentQuestionIndex];
    bool isLastQuestion =
        currentQuestionIndex == widget.assignment.questions.length - 1;

    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      appBar: AppBar(
        title: Text(widget.assignment.name,
            style: TextStyle(
              color: Theme.of(context).colorScheme.onSecondary,
            )),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Text(currentQuestion.prompt,
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: Theme.of(context).colorScheme.background ==
                          Colors.white
                      ? Colors
                          .black // Text color is black if background is white
                      : Theme.of(context).colorScheme.onSecondary,
                )),
          ),
          Expanded(
            child: ListView.builder(
              itemCount: currentQuestion.choices.length,
              itemBuilder: (context, index) {
                return ListTile(
                  leading: Radio<int>(
                    value: index,
                    groupValue: selectedChoiceIndex,
                    onChanged: (int? value) {
                      if (value != null) {
                        if (selectedChoices.length > currentQuestionIndex) {
                          selectedChoices[currentQuestionIndex] =
                              currentQuestion.choices[value];
                        } else {
                          selectedChoices.add(currentQuestion.choices[value]);
                        }
                      }
                      setState(() {
                        selectedChoiceIndex = value;
                      });
                    },
                    activeColor: Theme.of(context).colorScheme.secondary,
                  ),
                  title: Text(currentQuestion.choices[index],
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: Theme.of(context).colorScheme.background ==
                                Colors.white
                            ? Colors
                                .black // Text color is black if background is white
                            : Theme.of(context).colorScheme.onSecondary,
                      )),
                  onTap: () {
                    if (selectedChoiceIndex != null) {
                      selectedChoices[currentQuestionIndex] =
                          currentQuestion.choices[selectedChoiceIndex!];
                    }
                    setState(() {});
                  },
                );
              },
            ),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).colorScheme.secondary,
                  foregroundColor: Theme.of(context).colorScheme.secondary,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                onPressed: currentQuestionIndex > 0
                    ? () {
                        setState(() {
                          currentQuestionIndex--;
                          selectedChoiceIndex = null;
                        });
                      }
                    : null,
                child: Text('Previous',
                    style: TextStyle(
                      color: Theme.of(context).colorScheme.onSecondary,
                    )),
              ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).colorScheme.secondary,
                  foregroundColor: Theme.of(context).colorScheme.secondary,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                onPressed: selectedChoiceIndex != null
                    ? () {
                        if (!isLastQuestion) {
                          setState(() {
                            currentQuestionIndex++;
                            selectedChoiceIndex = null;
                          });
                        } else {
                          createAttempt();
                        }
                      }
                    : null,
                child: Text(isLastQuestion ? 'Submit' : 'Next',
                    style: TextStyle(
                      color: Theme.of(context).colorScheme.onSecondary,
                    )),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void createAttempt() async {
    ApiService apiService = ApiService();
    try {
      var response = await apiService.createAssignmentAttempt(
          widget.assignment.id, selectedChoices);
      int grade = response['attempt']['score'];

      showResultDialog(context, grade);

      if (grade == 100) {
        showConfetti = true;
        _confettiController.play();
        updateMasteryPoints();
      }
    } catch (e) {
      print('Error creating assignment attempt: $e');
    }
  }

  void updateMasteryPoints() async {
    if (_user == null) {
      print('User data not available');
      return;
    }

    ApiService apiService = ApiService();
    try {
      int newMastery = _user!.mastery + 10;
      Map<String, dynamic> updates = {'mastery': newMastery};

      var response =
          await apiService.editStudentProfile(_user!.suiteEmail, updates);
      if (response != null) {
        setState(() {
          _user = response; // Update the local user object
        });
      }
    } catch (e) {
      print('Error updating mastery points: $e');
    }
  }

  void showResultDialog(BuildContext context, int grade) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: Theme.of(context).colorScheme.primary,
          title: Text("Result",
              style: TextStyle(
                color: Theme.of(context).colorScheme.onSecondary,
              )),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (showConfetti)
                ConfettiWidget(
                  confettiController: _confettiController,
                  blastDirectionality: BlastDirectionality.explosive,
                  numberOfParticles: 70,
                  emissionFrequency: 0.01,
                ),
              Text(grade >= 90 ? "Congratulations!" : "",
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.onSecondary,
                  )),
              Text("Your grade: $grade%",
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.onSecondary,
                  )),
            ],
          ),
          actions: <Widget>[
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).colorScheme.secondary,
                foregroundColor: Theme.of(context).colorScheme.onSecondary,
              ),
              child: Text("Try Again",
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.onSecondary,
                  )),
              onPressed: () {
                Navigator.of(context).pop();
                setState(() {
                  currentQuestionIndex = 0;
                  selectedChoiceIndex = null;
                  selectedChoices.clear();
                  showConfetti = false;
                });
              },
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).colorScheme.secondary,
              ),
              child: Text("Exit",
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.onSecondary,
                  )),
              onPressed: () {
                Navigator.of(context).pop(); // Closes the dialog
                Navigator.maybePop(context);
              },
            ),
          ],
        );
      },
    );
  }
}
