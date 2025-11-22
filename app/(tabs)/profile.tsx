import { ScrollView } from "react-native";

export default function ProfileCard() {
  return (
    <ScrollView>
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto w-full">
          {/* Cards */}
          <div className="flex flex-col md:flex-row gap-8 mb-16">
            {/* CARD A */}
            <div className="flex-1 relative">
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden pt-6">
                {/* Image */}
                <div className="relative w-32 aspect-square rounded-full overflow-hidden mx-auto bg-orange-300">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-xl font-semibold text-gray-900">
                      Natasha Romanoff
                    </p>
                  </div>

                  <p className="text-gray-600 text-sm mb-6">
                    I am a Brand Designer who focuses on clarity & emotional
                    connection.
                  </p>

                  {/* Stats */}
                  <div className="flex w-full items-center text-center justify-around gap-6 mb-6 px-6">
                    <div className="flex items-center gap-1 ">
                      <p className="font-semibold text-gray-900">4.8</p>
                      <p className="text-sm text-gray-500 ml-1">Rating</p>
                    </div>
                    <div className="h-10 w-0.5 rounded-full bg-zinc-300"></div>

                    <div>
                      <p className="font-semibold text-gray-900">1+</p>
                      <p className="text-sm text-gray-500">Years</p>
                    </div>

                    <div className="h-10 w-0.5 rounded-full bg-zinc-300"></div>
                    <div>
                      <p className="font-semibold text-gray-900">3</p>
                      <p className="text-sm text-gray-500">Property</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD B */}
            <div className="flex-1 relative">
              <div className="bg-gray-900 rounded-3xl shadow-lg overflow-hidden">
                <div className="relative h-[500px]">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop"
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-linear-to-b from-transparent via-gray-900/50 to-gray-900" />

                  <div className="relative h-full flex flex-col justify-end p-6">
                    {/* Name */}
                    <div className="flex items-center gap-2 mb-3">
                      <p className="text-xl font-semibold text-white">
                        Natasha Romanoff
                      </p>
                    </div>

                    <p className="text-gray-200 text-sm mb-6">
                      I am a Brand Designer who focuses on clarity & emotional
                      connection.
                    </p>

                    {/* Stats */}
                    <div className="flex w-full items-center text-center justify-around gap-6 mb-6 px-6">
                      <div className="flex items-center gap-1 ">
                        <p className="font-semibold text-white">4.8</p>
                        <p className="text-sm text-gray-300 ml-1">Rating</p>
                      </div>
                      <div className="h-10 w-0.5 rounded-full bg-zinc-300"></div>

                      <div>
                        <p className="font-semibold text-white">1+</p>
                        <p className="text-sm text-gray-300">Years</p>
                      </div>

                      <div className="h-10 w-0.5 rounded-full bg-zinc-300"></div>
                      <div>
                        <p className="font-semibold text-white">3</p>
                        <p className="text-sm text-gray-300">Property</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollView>
  );
}
