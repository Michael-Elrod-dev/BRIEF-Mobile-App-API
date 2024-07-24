import 'package:flutter/material.dart';
import 'data.dart';

class RewardsPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final List<Reward> rewards = [
      Reward(
          title: 'Free Bike',
          icon: Icons.pedal_bike,
          progress: 0.2,
          total: 10000),
      Reward(
          title: 'Bojangles Biscuit',
          icon: Icons.lunch_dining,
          progress: 0.7,
          total: 100),
      Reward(
          title: 'Free Cookie', icon: Icons.cookie, progress: 1.0, total: 50),
      Reward(
          title: 'Pizza Dinner',
          icon: Icons.local_pizza,
          progress: 0.6,
          total: 500),
      // Add more rewards data as needed
    ];

    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      appBar: AppBar(
        title: Text('Rewards'),
      ),
      body: ListView.builder(
        itemCount: rewards.length,
        itemBuilder: (context, index) {
          final reward = rewards[index];
          return Padding(
            padding: const EdgeInsets.all(12.0),
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 24.0),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.primary,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.2),
                    spreadRadius: 1,
                    blurRadius: 1,
                    offset: Offset(0, 1),
                  ),
                ],
              ),
              child: Column(
                children: [
                  ListTile(
                    contentPadding: EdgeInsets.symmetric(horizontal: 16.0),
                    leading: Icon(
                      reward.icon,
                      size: 60,
                      color: Theme.of(context).colorScheme.onSecondary,
                    ),
                    title: Text(
                      reward.title,
                      style: TextStyle(
                        fontSize: 20,
                        color: Theme.of(context).colorScheme.onSecondary,
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.fromLTRB(16.0, 8.0, 16.0, 0.0),
                    child: ClipRRect(
                      borderRadius: BorderRadius.all(Radius.circular(10)),
                      child: LinearProgressIndicator(
                        value: reward.progress,
                        minHeight: 10,
                        backgroundColor: Theme.of(context).dividerColor,
                        valueColor: AlwaysStoppedAnimation<Color>(
                          Theme.of(context).colorScheme.secondary,
                        ),
                      ),
                    ),
                  ),
                  Text(
                    '${(reward.total)}' ' points',
                    style: TextStyle(
                      fontSize: 12,
                      fontFamily: 'RobotoMono',
                      color: Theme.of(context).colorScheme.onSecondary,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
