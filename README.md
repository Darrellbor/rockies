#Rockies
<small>This is an event platform for Africa and Nigeria</small>

#features
<ul>
    <li>View events and sort them by various criteria</li>
    <li>Buy tickets and have it sent to your mail</li>
    <li>Make platform recommendation of events for logged in users</li>
    <li>Enable users register and login</li>
    <li>Allow users to create events and track it.</li>
</ul>

#Api Endpoints
<h3>Event</h3>
<ul>
    <li>GET /api/events/search</li>
    <li>POST /api/events/search</li>
    <li>POST /api/events</li>
    <li>GET /api/events/:id</li>
    <li>PUT /api/events/:id</li>
    <li>PATCH /api/events/:id</li>
    <li>DELETE /api/events/:id</li>
    <li>GET /api/events/organizer/:id</li>
    <li>GET /api/events/:id/orders</li>
    <li>POST /api/events/:id/orders</li>
</ul>

<h3>Reviews</h3>
<ul>
    <li>GET /api/events/:id/reviews</li>
    <li>POST /api/events/:id/reviews</li>
    <li>PUT /api/events/:id/reviews/:reviewId</li>
    <li>DELETE /api/events/:id/reviews/:reviewId</li>
</ul>

<h3>Settings</h3>
<ul>
    <li>GET /api/settings/categories</li>
    <li>POST /api/settings/categories</li>
    <li>GET /api/settings/locations</li>
    <li>POST /api/settings/locations</li>
    <li>GET /api/locations</li>
</ul>

<h3>Users</h3>
<ul>
    <li>POST /api/users/register</li>
    <li>POST /api/users/login</li>
    <li>GET /api/users/profile</li>
    <li>PUT /api/users/profile</li>
    <li>PATCH /api/profile</li>
    <li>GET /api/users/tickets</li>
    <li>GET /api/users/events</li>
    <li>GET /api/users/event/:id/tickets/:orderId</li>
    <li>GET /api/users/events/reviews</li>
    <li>POST /api/users/forgotPassword</li>
    <li>POST /api/users/feedback</li>
</ul>

<h3>Organizers</h3>
<ul>
    <li>GET /api/organizer</li>
    <li>POST /api/organizer</li>
    <li>GET /api/organizer/:id</li>
    <li>PUT /api/organizer/:id</li>
    <li>PATCH /api/organizer/:id</li>
    <li>DELETE /api/organizer/:id</li>
</ul>