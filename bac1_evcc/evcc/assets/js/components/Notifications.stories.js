import Notifications from "./Notifications.vue";

export default {
  title: "Main/Notifications",
  component: Notifications,
  argTypes: {},
};

const Template = (args) => ({
  setup() {
    return { args };
  },
  components: { Notifications },
  template: '<Notifications v-bind="args"></Notifications>',
});

function timeAgo(hours = 0, minutes = 0, seconds = 0) {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  date.setMinutes(date.getMinutes() - minutes);
  date.setSeconds(date.getSeconds() - seconds);
  return date;
}

export const Base = Template.bind({});
Base.args = {
  notifications: [
    {
      message: "Server unavailable",
      type: "error",
      time: timeAgo(),
      count: 1,
    },
    {
      message: "charger out of sync: expected disabled, got enabled",
      type: "warn",
      count: 4,
      time: timeAgo(0, 0, 42),
    },
    {
      message: "Sponsortoken: x509: certificate has expired",
      type: "error",
      count: 1,
      time: timeAgo(1, 12, 44),
    },
    {
      message:
        "Block device full: can not write to /tmp/evcc/foobarloremawefhwuiehfwuiehfwiauhefjkajowaeigjwalvmoweivwail",
      type: "error",
      count: 1,
      time: timeAgo(1, 12, 44),
    },
    {
      message: "charger out of sync: expected disabled, got enabled",
      type: "warn",
      count: 4,
      time: timeAgo(1, 22, 0),
    },
    {
      message: "vehicle remote charge start: invalid character '<' looking for beginning of value",
      type: "warn",
      count: 3,
      time: timeAgo(4, 2, 0),
    },
    {
      message:
        "Amet irure quis incididunt voluptate esse. Commodo ea sunt est ipsum tempor nisi laboris voluptate labore elit laborum. Ex irure commodo reprehenderit consequat consequat do ad tempor aliquip deserunt eu. Laboris minim nostrud quis nisi. Dolor occaecat reprehenderit velit dolore exercitation cupidatat et voluptate. Nulla pariatur deserunt esse minim nisi nisi nulla. Sit eiusmod do incididunt sint minim pariatur aute.",
      type: "warn",
      count: 1,
      time: timeAgo(5, 2, 44),
    },
  ],
};
