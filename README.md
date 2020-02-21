<p  align="center">

<img  src="https://user-images.githubusercontent.com/41849970/74642877-c8448000-5199-11ea-83eb-e2cbc2f98606.png">

</p>

# CollBeet Assistant

CollBeet Assistant is a Google Action designed to work as a personal companion for college students. It will keep track of student essentials such as daily lecture schedules, canteen schedules and daily announcements. It automatically detects user's time and responds accordingly. Other than that, CollBeet Assistant can also be setup to let students know directions to different locations around the campus such as different staffrooms, labs, Principal office, Admin office, Auditorium etc and basic college info such as college website, address and phone number. Adding data to CollBeet Assistant is easy due to [CollBeet Admin](https://github.com/kalol-institute-of-technology/CollBeet-Admin/), a dashboard interface which lets Administrators manage, add and update data in realtime for entire college super quickly and eaily. Since it is a completely open source project, feel free to use CollBeet Assistant to create a fully customised Conversational AI, that best suits your college need.

---

## Index
* [Prerequisites](#prerequisites)
* [Deployment](#deployment)
    * [Setup Project and Agent](#setup-project-and-agent)
    * [Deploy your fulfillment](#deploy-your-fulfillment)
    * [Retrieve the deployment URL](#retrieve-the-deployment-url)
    * [Set the URL in Dialogflow](#set-the-url-in-dialogflow)
* [Sample Utterances](#sample-utterances)
    * [Student Schedule](#student-schedule)
    * [Mess Schedule](#mess-schedule)
    * [Daily Announcements](#daily-announcements)
    * [College Locations](#college-locations)
    * [College Info](#college-info)
    * [User Utterances](#user-utterances)
 * [Publishing Your Action](#publishing-your-action)
 * [Actions Using CollBeet](#actions-using-collbeet)
    
---

## Prerequisites

1. Node.js and NPM
2. Install the [Firebase CLI](https://firebase.google.com/docs/cli/)
3. CollBeet Admin

---

## Deployment

**Note: Before proceeding, make sure you have [CollBeet Admin](https://github.com/kalol-institute-of-technology/CollBeet-Admin) up and running on a server.**

---

### Setup Project and Agent

1. Clone this repo on to your local machine using following command.

      `git clone https://github.com/kalol-institute-of-technology/CollBeet-Assistant`

1. Open the [Actions Console](https://console.actions.google.com/).

1. Click **New project**.

1. Type in a **Project name**. This name is for your own internal reference; later on, you can set an external name for your project.

1. Click **Create Project**.

1. Rather than pick a category, scroll down to the More options section and click the **Conversational card**.

1. Click **Build your Action** to expand the options and select **Add Action(s)**.

1. Click **Add your first Action**.

1. On the **Custom intent** dialog, click **Build** to launch the Dialogflow console.

1. Click **Create**.

1. Click the gear icon on the left navigation.

1. Click **Export and Import**.

1. Click **Restore From Zip**.

1. **Upload** the `CollBeetAssistantAgent.zip` file from cloned repo folder.

1. Type **"RESTORE"** and click the **Restore** button.

1. Click **Done**

---

### Deploy your fulfillment

Now that your Actions project and Dialogflow agent are ready, do the following to deploy your local index.js file using the Firebase Functions CLI:

1. In a **terminal**, navigate to the **/functions** directory of your base files clone.

1. Using the Actions project ID, run the following command:

        firebase use --project <PROJECT_ID>

1. **Run** the following command in the terminal to **install dependencies**.

        npm install

1. **Setup** Environemental Variables. You will require either the external IP or custom domain of deployed CollBeet Admin Server, once you have that **run** the following command:

        firebase functions:config:set envariables.server_url="<SERVER_URL>"
        
   **For example:** If your custom domain is `https://collbeet.test`, you need to **run** the following command:
 
         firebase functions:config:set envariables.server_url="https://collbeet.test"     
         
1. Go the the **index.js** file and personlise the phrase `Welcome to CollBeet Assistant. How can I help you?.` in **Default Welcome Intent**. **Save** the file. **Note**: Can be done later also.
        
1. **Run** the following command in the terminal to deploy your webhook to Firebase.

        firebase deploy --project <PROJECT_ID>
        
After a few minutes, you should see **"Deploy complete!"** indicating that you've successfully deployed your webhook to Firebase.

---

### Retrieve the deployment URL

1. Open the [Firebase Console](https://console.firebase.google.com/).

1. Select your **Actions project** from the list of options.

1. Navigate to **Develop > Functions** on the left navigation bar. If you're prompted to **"Choose data sharing settings"**, you can ignore this option by clicking Do this later.

1. Under the **Dashboard** tab, you should see an entry for **"dialogflowFirebaseFulfillment"** with a URL under Trigger. **Copy this URL**.

---

### Set the URL in Dialogflow

1. Open the **Dialogflow console**.

1. Navigate to **Fulfillment** on the left navigation.

1. Enable **Webhook**.

1. **Paste the URL** you copied from the Firebase dashboard if it doesn't already appear.

1. Click **Save*.

---

## Sample Utterances

Following are all the phrases that can be used to interact with the CollBeet Assistant.

---

### Student Schedule

**Upcoming Lecture**

   ```
   What is my next lecture ?
   ```
   
**Today's Lecture Schedule**

   ```
   List All Today's Lectures
   ```
   
**Tomorrow's Lecture Schedule**

   ```
   List All Tomorrow's Lectures
   ```
   
---

### Mess Schedule

**Breakfast Inquiry**
   
   ```
   What's in Breakfast today?
   ```
   
**Lunch Inquiry**
   
   ```
   What's in Lunch today?
   ```

**Snacks Inquiry**
   
   ```
   What's in Snacks today?
   ```

**Dinner Inquiry**
   
   ```
   What's in Dinner today?
   ```

**Today's Mess Hall Schedule**
   
   ```
   Can I get canteen schedule for today?
   ```

**Tomorrow's Mess Hall Schedule**
   
   ```
   Can I get canteen schedule for tomorrow?
   ```
   
---


### Daily Announcements

**Hear Daily Announcements**

   ```
   Any announcements today?
   ```
   
---

### College Locations

**Location Of Staffroom**

   ```
   Where can I find [Department Name] Staff room?
   ```
   
**Location Of Lab**

   ```
   Where can I find [Department Name] Lab?
   ```
   
**Location Of Principal Office**

   ```
   Where can I find Principal's Office?
   ```
   
**Location Of Admin Office**

   ```
   Where can I find Admin's Office?
   ```
   
**Location Of Cafeteria**

   ```
   Where can I find Cafeteria?
   ```

**Location Of Mess Hall**

   ```
   Where can I find Mess Hall?
   ```

**Location Of Auditorium**

   ```
   Where can I find Auditorium?
   ```
   
**Location Of Security Cabin**

   ```
   Where can I find Security Cabin?
   ```
   
---
   
### College Info

**College Name**

   ```
   What is our college name?
   ```
   
**College Address**
   
   ```
   What is our college address?
   ```
   
**College Website**
   
   ```
   What is our college website?
   ```
   
**College Phone Number**
   
   ```
   What is our college phone number?
   ```
   
---

### User Utterances

**Change/Add User Details**
   
   ```
   Setup User Details
   ```
   
**Stop Intent**
   
   ```
   Stop
   ```
   
---

## Publishing Your Action

To publish an Action on store made using CollBeet, you can use any Invocation name and description of your choice (as long as it adheres to [Google Policies](https://developers.google.com/assistant/console/policies/general-policies)), that you think is best suited for you and your college.

Make sure to go through this [Pre-launch checklists](https://developers.google.com/assistant/conversational/checklist), for pain less submission process.

For **privacy policy**, you can use a copy of the following [sample version](https://docs.google.com/document/d/1oYf_ZOn42SrsUFUesY9_GI6FaBXzYlclWHoHJTCNdDE/edit?usp=sharing). 

## Actions using CollBeet

Following are the Actions using CollBeet:

---

| Action Icon | Action Name      | Action Description                                                                                                                                                                                                                                                                                                 |
|-------------|------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ![](https://user-images.githubusercontent.com/41849970/74735003-ce0f9380-5275-11ea-8f3a-fc642fd4ae12.png)         | Sandra Companion | Sandra Companion is a conversational AI deployed in [Kalol Institute Of Technology and Research Center](http://www.kirc.ac.in/), used by students of all Engineering branches, in their day to day life. You can access Sandra Companion from [here](https://assistant.google.com/services/a/uid/00000068b3c470ee?hl=en-GB&source=web) |

---
