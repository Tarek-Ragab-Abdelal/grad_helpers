## Helpers For Grad Project

### How to use:

1. Clone the repo: `git clone https://github.com/Tarek-Ragab-Abdelal/grad_helpers.git`
2. Run install to setup the env `npm install`
   - Note: Make sure that you have nodeJs installed on your PC before this.
3. Run any of the following scripts as per requirements
   1. Create Resources:
      - go to `createResources.js` and you may edit the info to be created, if you would like.
      - run `node .\createResources.js`
   2. Populate database:
      - You may run createResources first, or if you have a system runnning with a sensor created to it only.
      - go to `populateReadings.js` and edit each of:
        - sensorId => to id of an existing sensor in your system
        - token => to an active token within you system
      - run `node .\populateReadings.js`
   3. Export Readings to CSV:
      - Under Creation
