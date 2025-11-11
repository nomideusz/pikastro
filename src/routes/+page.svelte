<script lang="ts">
	// Portfolio data - this can be moved to a separate file later
	const projects = [
		{
			title: 'Brand Identity Design',
			description: 'Complete visual identity system including logo, typography, and brand guidelines.',
			technologies: ['Adobe Illustrator', 'Photoshop', 'InDesign'],
			image: '/placeholder-project-1.jpg'
		},
		{
			title: 'Web UI/UX Design',
			description: 'Modern interface design for a SaaS platform with focus on user experience.',
			technologies: ['Figma', 'Sketch', 'Principle'],
			image: '/placeholder-project-2.jpg'
		},
		{
			title: 'Print Design Campaign',
			description: 'Multi-piece print campaign for a local business including brochures and posters.',
			technologies: ['InDesign', 'Photoshop', 'Illustrator'],
			image: '/placeholder-project-3.jpg'
		}
	];
</script>

<!-- Hero Section -->
<section class="section bg-white">
	<div class="text-center">
		<img src="/logo.png" alt="Picastro Logo" class="w-[400px] h-[100px] mx-auto mb-8" />
		<div class="flex flex-col sm:flex-row gap-4 justify-center">
			<a href="#work" class="btn">View My Work</a>
			<a href="#contact" class="btn bg-white text-gray-900 border border-gray-300 hover:bg-gray-50">
				Get In Touch
			</a>
		</div>
	</div>
</section>

<!-- About Section -->
<section id="about" class="section bg-gray-50">
	<div class="grid md:grid-cols-2 gap-12 items-center">
		<div>
			<h2 class="text-3xl font-bold text-gray-900 mb-6">About Me</h2>
			<p class="text-gray-600 mb-4">
				I'm a passionate graphic designer with over 5 years of experience creating visual solutions
				for startups, established brands, and creative projects. My approach combines technical
				expertise with artistic vision to deliver designs that not only look great but work effectively.
			</p>
			<p class="text-gray-600 mb-6">
				When I'm not designing, you'll find me exploring the intersection of technology and art,
				experimenting with new tools, and contributing to the design community.
			</p>
			<div class="grid grid-cols-2 gap-4">
				<div class="text-center p-4 bg-white rounded">
					<div class="text-2xl font-bold text-gray-900">50+</div>
					<div class="text-sm text-gray-600">Projects Completed</div>
				</div>
				<div class="text-center p-4 bg-white rounded">
					<div class="text-2xl font-bold text-gray-900">5+</div>
					<div class="text-sm text-gray-600">Years Experience</div>
				</div>
			</div>
		</div>
		<div class="bg-white p-8 rounded shadow-sm">
			<h3 class="text-xl font-semibold text-gray-900 mb-4">Expertise</h3>
			<ul class="space-y-3 text-gray-600">
				<li class="flex items-center">
					<span class="w-2 h-2 bg-gray-900 rounded-full mr-3"></span>
					Brand Identity & Logo Design
				</li>
				<li class="flex items-center">
					<span class="w-2 h-2 bg-gray-900 rounded-full mr-3"></span>
					Web & UI/UX Design
				</li>
				<li class="flex items-center">
					<span class="w-2 h-2 bg-gray-900 rounded-full mr-3"></span>
					Print Design & Layout
				</li>
				<li class="flex items-center">
					<span class="w-2 h-2 bg-gray-900 rounded-full mr-3"></span>
					Typography & Visual Systems
				</li>
				<li class="flex items-center">
					<span class="w-2 h-2 bg-gray-900 rounded-full mr-3"></span>
					Art Direction & Consulting
				</li>
			</ul>
		</div>
	</div>
</section>

<!-- Work Section -->
<section id="work" class="section bg-white">
	<div class="text-center mb-12">
		<h2 class="text-3xl font-bold text-gray-900 mb-4">Selected Work</h2>
		<p class="text-gray-600 max-w-2xl mx-auto">
			A curated selection of projects that showcase my design process and creative approach.
		</p>
	</div>

	<div class="grid md:grid-cols-3 gap-8">
		{#each projects as project}
			<div class="bg-gray-50 rounded overflow-hidden hover:shadow-md transition-shadow">
				<div class="aspect-video bg-gray-200 flex items-center justify-center">
					<span class="text-gray-500">Project Image</span>
				</div>
				<div class="p-6">
					<h3 class="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
					<p class="text-gray-600 mb-4">{project.description}</p>
					<div class="flex flex-wrap gap-2">
						{#each project.technologies as tech}
							<span class="px-2 py-1 bg-gray-200 text-gray-700 text-sm rounded">
								{tech}
							</span>
						{/each}
					</div>
				</div>
			</div>
		{/each}
	</div>

	<div class="text-center mt-12">
		<a href="/work" class="btn">View All Projects</a>
	</div>
</section>

<!-- Contact Section -->
<section id="contact" class="section bg-gray-900 text-white">
	<div class="text-center">
		<h2 class="text-3xl font-bold mb-4">Let's Work Together</h2>
		<p class="text-gray-300 mb-8 max-w-2xl mx-auto">
			I'm always interested in new opportunities and collaborations.
			Whether you have a project in mind or just want to chat about design, I'd love to hear from you.
		</p>

		<div class="grid md:grid-cols-3 gap-8 mb-8">
			<div class="text-center">
				<div class="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
					<span class="text-xl">✉</span>
				</div>
				<h3 class="font-semibold mb-2">Email</h3>
				<p class="text-gray-300">hello@picastro.design</p>
			</div>
			<div class="text-center">
				<div class="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
					<span class="text-xl">📍</span>
				</div>
				<h3 class="font-semibold mb-2">Location</h3>
				<p class="text-gray-300">Remote / Worldwide</p>
			</div>
			<div class="text-center">
				<div class="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
					<span class="text-xl">💼</span>
				</div>
				<h3 class="font-semibold mb-2">Status</h3>
				<p class="text-gray-300">Available for Projects</p>
			</div>
		</div>

		<div class="flex justify-center space-x-6">
			<a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
				<span>𝕏</span>
			</a>
			<a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
				<span>λ</span>
			</a>
			<a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
				<span>📘</span>
			</a>
		</div>
	</div>
</section>

<!-- Footer -->
<footer class="bg-gray-50 py-8 px-4">
	<div class="max-w-6xl mx-auto text-center text-gray-600">
		<p>&copy; 2025 Picastro. All rights reserved.</p>
	</div>
</footer>
