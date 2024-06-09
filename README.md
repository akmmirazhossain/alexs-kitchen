# Alex's Kitchen
Welcome to Alex's Kitchen!


## Table of Contents


- [Question 1: Hotfix Procedure](#question-1-hotfix-procedure)
- [Question 2: Menu Item Categorization](#question-2-menu-item-categorization)

---


---

## Question 1: Hotfix Procedure

A project titled, “Alex’s Kitchen” from team "Remote Kitchen" uses Git for version control. Several developers are contributing, with each working on their own branch. The team follows certain conventions. Suppose you need to submit a hotfix. How would you name your branch? After finalizing your work in your designated branch, detail the steps you would take to create a PR and merge it with the production branch.

## Answer:

I am sharing all the steps from a fresh start:

#### Step 1: Initialize a Git Repository

```bash
git init
```

#### Step 2: Add the project's remote repo and fetch changes

```bash
git remote add origin https://github.com/akmmirazhossain/alexs-kitchen/
git fetch
```

#### Step 3: I will switch to the production branch

```bash
git checkout production
git pull origin production
```

#### Step 4: I will make changes to the files as required and add, commit, push 
Here I will name the remote branch in such way so that my team members understands its purpose and in which code segement the change is getting applied 

```bash
git add .
git commit -m "Fixed Menu API CORS policy errors"
git push origin hotfix/menu-api

```

#### Step 5: Pull Request and Merge

- Navigate to GitHub.
- Go to **Pull request**.
- Click on **Compare and pull request**.
- Select the production branch as the base and `hotfix/menu-api` as the compare branch.
- Provide a description for the project lead to understand and approve the pull request.
- Click **Merge pull request**.



## Question 2: Menu Item Categorization

In a Digital Kitchen, we have an array of Menu collections. Each collection is an object of Menu. And contains two properties alongside with various properties of Menu. Which are, menuItems (which is an array of objects. Each object has a unique identifier) and, categories. Categories itself is an array of objects. In each object inside categories, there is one property (an array of int’s) called, menuItemsIds.

Find out the specific items that belongs to each category.
Take a reference from below code snippet,
```bash
const dummyArr = [
    {
      type: "Vegetarian",
      menuItems: [
        {id: 1, name: "Salad"},
        {id: 2, name: "Veg Burger"},
        {id: 3, name: "Pasta"}
      ],
      category: [{
        name: "Starters",
        menuItems:[1,2]
      }]
    },
    {
      type: "Non-Vegetarian",
      menuItems: [
        {id: 4, name: "Chicken Wings"},
        {id: 5, name: "Beef Burger"},
        {id: 6, name: "Shrimp Pasta"}
      ],
      category: [{
        name: "Main Course",
        menuItems:[4,5]
      }]
    }
]
```
Discuss the conceptual approach. Explain, how you will resolve this or get the data based on the conditions where id’s are being matched, keeping aside the specifics of coding.


## Answer:

The data will look like this 

- Vegetarian
  - Starters
    - Salad
    - Veg Burger
- Non-Vegetarian
  - Starters
    - Chicken Wings
    - Beef Burger

As you can see, each of the menu collection's category object has menuItems array with IDs that matches their own collection's menuItems array IDs which represent the name of the food, so I will simply run a loop and iterate over each menu collection, then for each category within the collection, and iterate over the menu item IDs. And for each ID, I will find the matching ID from the parent menuItems array and print the respective food name.   
