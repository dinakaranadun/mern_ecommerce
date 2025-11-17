import Footer from '@/components/common/footer';
import { Button } from '@/components/ui/button';
import { 
  ShoppingBag, 
  Users, 
  Award, 
  Heart,
  TrendingUp,
  Shield,
  Truck,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-black to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              About Our Store
            </h1>
            <p className="text-xl text-gray-300">
              We're passionate about bringing you the best products with exceptional service. 
              Since our founding, we've been dedicated to making online shopping easy, 
              reliable, and enjoyable.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            icon={<Users className="w-8 h-8" />}
            number="1K+"
            label="Happy Customers"
            color="blue"
          />
          <StatCard
            icon={<ShoppingBag className="w-8 h-8" />}
            number="5K+"
            label="Products Sold"
            color="green"
          />
          <StatCard
            icon={<Award className="w-8 h-8" />}
            number="1 Years"
            label="In Business"
            color="purple"
          />
          <StatCard
            icon={<TrendingUp className="w-8 h-8" />}
            number="99%"
            label="Satisfaction Rate"
            color="orange"
          />
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Founded in 2025, our journey began with a simple mission: to provide 
                high-quality products that make life better. What started as a small 
                operation has grown into a trusted e-commerce destination serving 
                thousands of customers across the country.
              </p>
              <p>
                We believe that shopping online should be more than just convenient—it 
                should be an experience. That's why we carefully curate our product 
                selection, ensure fast and reliable shipping, and provide customer 
                service that goes above and beyond.
              </p>
              <p>
                Today, we continue to innovate and improve, always keeping our 
                customers at the heart of everything we do. Thank you for being 
                part of our journey.
              </p>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop"
              alt="Our Team"
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500" />
                <div>
                  <p className="font-bold text-gray-900">Customer First</p>
                  <p className="text-sm text-gray-600">Always</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ValueCard
              icon={<Shield className="w-12 h-12" />}
              title="Quality Guaranteed"
              description="We stand behind every product we sell with our quality guarantee."
              color="blue"
            />
            <ValueCard
              icon={<Truck className="w-12 h-12" />}
              title="Fast Delivery"
              description="Quick and reliable shipping to get your orders to you faster."
              color="green"
            />
            <ValueCard
              icon={<Heart className="w-12 h-12" />}
              title="Customer Care"
              description="Dedicated support team ready to help you anytime."
              color="red"
            />
            <ValueCard
              icon={<Clock className="w-12 h-12" />}
              title="Always Available"
              description="Shop 24/7 with our always-on online store."
              color="purple"
            />
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Meet Our Team
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The people behind your shopping experience
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <TeamMember
            image="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop"
            name="Dinakara"
            role="Founder & CEO"
          />
          <TeamMember
            image="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop"
            name="Sky"
            role="Head of Operations"
          />
          <TeamMember
            image="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop"
            name="Nadun"
            role="Customer Support"
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className=" text-black py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Explore our curated collection of products
          </p>
          <Link to='/shop/listing'>
            <Button className=' h-15 w-50 rounded-2xl hover:cursor-pointer' >
             Browse Products <ArrowRight className='w-5 h-5'/>
          </Button>
          </Link>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

const StatCard = ({ icon, number, label, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg text-center hover:shadow-xl transition-shadow">
      <div className={`inline-flex p-4 rounded-xl ${colorClasses[color]} mb-4`}>
        {icon}
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-2">{number}</p>
      <p className="text-gray-600">{label}</p>
    </div>
  );
};

const ValueCard = ({ icon, title, description, color }) => {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    purple: 'text-purple-600'
  };

  return (
    <div className="text-center">
      <div className={`inline-flex p-4 rounded-xl bg-gray-100 ${colorClasses[color]} mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const TeamMember = ({ image, name, role }) => (
  <div className="group">
    <div className="relative overflow-hidden rounded-2xl mb-4">
      <img
        src={image}
        alt={name}
        className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <h3 className="text-xl font-bold text-gray-900">{name}</h3>
    <p className="text-gray-600">{role}</p>
  </div>
);

export default AboutUs;