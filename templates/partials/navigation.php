<?php
  $urlGenerator = \OC::$server->getURLGenerator();
?>

<div id="app-navigation">
  <ul>
    <li><a class="icon-category-monitoring" href="<?php echo $urlGenerator->linkToRoute('timemanager.page.index'); ?>">Dashboard</a></li>
    <li>
    	<a class="icon-category-social" href="<?php echo $urlGenerator->linkToRoute('timemanager.page.clients'); ?>">Clients</a>
  		<div class="app-navigation-entry-utils">
				<ul>
					<!-- <li class="app-navigation-entry-utils-counter">1</li> -->
  				<li class="app-navigation-entry-utils-menu-button">
          	<button></button>
      		</li>
    		</ul>
    	</div>
    	<div class="app-navigation-entry-menu">
		    <ul>
	        <li>
            <a href="#">
              <span class="icon-add"></span>
              <span>Add</span>
            </a>
	        </li>
		    </ul>
			</div>
    </li>
		<li>
			<a class="icon-category-office" href="<?php echo $urlGenerator->linkToRoute('timemanager.page.projects'); ?>">Projects</a>
			<div class="app-navigation-entry-utils">
				<ul>
					<!-- <li class="app-navigation-entry-utils-counter">1</li> -->
  				<li class="app-navigation-entry-utils-menu-button">
          	<button></button>
      		</li>
    		</ul>
    	</div>
    	<div class="app-navigation-entry-menu">
		    <ul>
	        <li>
            <a href="#">
              <span class="icon-add"></span>
              <span>Add</span>
            </a>
	        </li>
		    </ul>
			</div>
		</li>
		<li>
			<a class="icon-category-organization" href="<?php echo $urlGenerator->linkToRoute('timemanager.page.tasks'); ?>">Tasks</a>
			<div class="app-navigation-entry-utils">
				<ul>
					<!-- <li class="app-navigation-entry-utils-counter">1</li> -->
  				<li class="app-navigation-entry-utils-menu-button">
          	<button></button>
      		</li>
    		</ul>
    	</div>
    	<div class="app-navigation-entry-menu">
		    <ul>
	        <li>
            <a href="#">
              <span class="icon-add"></span>
              <span>Add</span>
            </a>
	        </li>
	        <li>
            <a href="#">
              <span class="icon-add"></span>
              <span>Log time</span>
            </a>
	        </li>
		    </ul>
			</div>
		</li>
    <li>
      <a class="icon-category-organization" href="<?php echo $urlGenerator->linkToRoute('timemanager.page.times'); ?>">Time Entries</a>
      <div class="app-navigation-entry-utils">
        <ul>
          <!-- <li class="app-navigation-entry-utils-counter">1</li> -->
          <li class="app-navigation-entry-utils-menu-button">
            <button></button>
          </li>
        </ul>
      </div>
      <div class="app-navigation-entry-menu">
        <ul>
          <li>
            <a href="#">
              <span class="icon-add"></span>
              <span>Add</span>
            </a>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</div>